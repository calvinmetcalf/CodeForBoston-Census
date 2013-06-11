//fix for the layer controls
L.Control.Layers.prototype._addItem= function (obj) {
	var label = document.createElement('label'),
		input,
		checked = this._map.hasLayer(obj.layer);
 
		if (obj.overlay) {
			input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('leaflet-base-layers', checked);
		}
		input.layerId = L.stamp(obj.layer);
		L.DomEvent.on(input, 'click', this._onInputClick, this);
		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;
		label.appendChild(input);
		label.appendChild(name);
		label.className = obj.overlay ? "checkbox" : "radio";
		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);
		return label;
};

var Viz = Backbone.Model.extend({
	defaults: {
		transform:false,
		stringRep:function(a){
				return  parseInt(a,10).toString(10);
			}
	}
});

var Vizes = Backbone.Collection.extend({
	model:Viz,
	data:{}
});

var vizes = new Vizes(items);

var Selector = Backbone.View.extend({
	el:$('#whichValue'),
	collection:vizes,
	template:Mustache.compile('{{#items}}<option value="{{name}}" data-get="{{tables}}">{{name}}</option>{{/items}}'),
	render:function(){
		this.$el.html(this.template({items:this.collection.toJSON()}));
	}
});
var selector = new Selector();
selector.render();

var Legend = Backbone.View.extend({
	template:Mustache.compile('<div class="span2"><div class="text-center"><strong>{{{current}}}</strong></div><ul class="legend">{{#items}}<li><span style="background: {{color}};"></span>{{value}}</li>{{/items}}</ul></div>'),
	render:function(){
	var cur = vizes.findWhere({name:$('#whichValue').val()});
		var sc = this.scale.quantiles();
		sc.push(sc[9]+1);
		mapFunc=function(a,i){
			var flip = cur.get('flip');
			var out =  {};
			if(i===0){
				out.value="<"+cur.get("stringRep")(sc[1]);
			}else if(i===10){
				out.value=">"+cur.get("stringRep")(a);
			}else{
				out.value=cur.get("stringRep")(a) + " - "+ cur.get("stringRep")(sc[i+1]);
			}
			
			out.color=colorbrewer.RdBu[11][!flip?10-i:i];
			if(flip){
				
			}
			return out;
		};
		var vals = sc.map(mapFunc);
			if(cur.get('flip')){
				vals.reverse();
			}
		this.$el.html(this.template({
			items:vals,
			flip:cur.get('flip'),
			current:vizes.findWhere({name:$('#whichValue').val()}).get('name').replace(/\(/,'<br/>(')
		}));
		sc.pop();
	},collection:vizes,
	initialize:function(){
		this.collection.on('renderLegend',function(){this.render()},this);
		this.scale = d3.scale.quantile();
		this.scale.range(d3.range(11));
	}
});

var Polys = Backbone.View.extend({
	el:$('#whichValue'),
	apiKey : '0a6b68796bfcfe694987a9ddf3eddd1b735dcd7f',
	urlBase : 'http://api.census.gov/data/2011/acs5',
	current : function(){return this.$el.val()},
	collection:vizes,
	obj:{},
	stRep : function(){
		return this.collection.findWhere({name:this.current()}).get('stringRep');
	},
	farOut:false,
	style:function(id){
		if(!this.obj[id]){
			return;
		}
		if(!this.collection.findWhere({name:this.current()}).get('flip')){
			return colorbrewer.RdBu[11][10-this.options.legend.scale(this.obj[id])];
		}else{
			return colorbrewer.RdBu[11][this.options.legend.scale(this.obj[id])];
		}
			
	},
	params : function(){
		return {
			"for":'county:*',
			"in":'state:*',
			"key":this.apiKey,
			"get":this.$('option:selected').data('get')
		}
	},
	events:{
		'change':'valueChange'
	},
	buildValues:function(oRows){
		var self=this;
		var vals = [];
		var metric = this.current();
		//var rows;
		var translate = self.collection.findWhere({name:metric}).get('translate');
			//if (translate) {
			//	rows=_.map(oRows,translate);
			//} else {
		//		rows=oRows;
		//	}
			//console.log(rows);
			_.each(oRows,function(row){
				var r;
				if (translate) {
					r=translate(row);
				} else {
					r=row;
				}
				//console.log(r,row);
				var val = parseFloat(r[0],10);
					self.obj[r[1]+r[2]]=val;
					if(val){
						vals.push(val);
					}
			});
		
		self.options.legend.scale.domain(vals);
		self.collection.trigger('renderLegend');
	},
	valueChange:function (){
		var self = this;
		$.ajax({url:polys.urlBase,data:polys.params(),dataType:'jsonp',jsonp:'jsonp',cache:true}).then(function(a){
			self.buildValues( a);
			self.collection.farOut=false;
			updateMap();
		});
	}
});

function makeRT(obj){
	var newObj={};
	if(typeof Worker === "function"){
		return communist(obj);
	} else {
		obj.rt=rTree();
		newObj.set=function(data){
			var promise = communist.deferred();
			obj.set(data,function(rst){
				promise.resolve(rst);
			});
			return promise.promise;
		};
		newObj.bbox=function(bbox){
			return communist.resolve(obj.bbox(bbox))
		};
		return newObj;
	}
}

//map stuff
var m = L.map('map');
if(!location.hash){
	m.setView([39.555,-91.187], 5);
}
m.addHash();
var MyControl = L.Control.extend({
	options: {
		position: 'bottomright'
	},

	onAdd: function (map) {
		// create the control container with a particular class name
		var container = L.DomUtil.create('div', 'my-custom-control leaflet-control-layers');
		container.id="legend";
		return container;
	}
});
m.addControl(new MyControl());
var layerControl = L.control.layers.provided(['MapQuestOpen.OSM','Stamen.Watercolor','OpenStreetMap.Mapnik','Stamen.Toner']).addTo(m);

//start views
var legend= new Legend({el:$('#legend')});
var polys= new Polys({legend:legend});

//set up webWorker
var rt = makeRT({
	initialize:function(){
		importScripts('js/rtree.js','js/topojson.js');
		this.rt=rTree();
	},
	set:function(data,cb){
		var gj=topojson.feature(data,data.objects.counties);
		this.rt.geoJSON(gj,function(err,data){
			if(!err){
				cb(gj);
			}
		});
	},
	bbox:function(data){return this.rt.bbox(data)}
});

//create the counties layer
var counties = L.geoJson({features:[]},{
	onEachFeature:function (f,l){
		var out = [];
		if (f.properties){
			for(var key in f.properties){
				out.push(key+": "+f.properties[key]);
			}
		}	
		var id=f.id.toString(10);
		if(id.length === 4){
			id = '0'+id;
		}
		var strep = polys.stRep();
		if(polys.obj[id]){
			out.push(polys.current()+': '+strep(polys.obj[id]));
		}
		l.bindPopup(out.join("<br />"));
	},style:function(f){
		var id=f.id.toString(10);
		if(id.length === 4){
			id = '0'+id;
		}
		if(polys.style(id)){
			return {fillColor:polys.style(id),weight:0,fillOpacity:0.8};
		}else{
			return {stroke:false,fill:false};
		}
	}
}).addTo(m);
//add it to the map
layerControl.addOverlay(counties,"Counties");
var geoJson,waiting;
//download data to start us off
$.when($.ajax('json/us-10m.json'),$.ajax({url:polys.urlBase,data:polys.params(),dataType:'jsonp',jsonp:'jsonp',cache:true})).then(function(a,b){
	vizes.data = a[0];
	var rows = b[0];
	polys.buildValues (rows);
	rt.set(vizes.data).then(function(a){
		geoJson=a;
		updateMap();
	});
});

m.on("contextmenu moveend",updateMap);
function updateMap(){
	var bounds = m.getBounds();
	var zoom = m.getZoom();
	var bbox = [
			[bounds.getSouthWest().lng,bounds.getSouthWest().lat],
			[bounds.getNorthEast().lng,bounds.getNorthEast().lat]
		];
	if(zoom<6){
		if(vizes.farOut){
			return;
		}else{
			counties.clearLayers();
			if(geoJson){
				vizes.farOut=true;
				counties.addData(geoJson);
			}
			return;
		}
	}else{
		if(vizes.farOut){
			vizes.farOut=false;
		}
	}
	rt.bbox(bbox).then(function(rData){
		counties.clearLayers();
		counties.addData(rData);
	});
}