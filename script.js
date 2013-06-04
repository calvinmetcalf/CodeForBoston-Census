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
	template:Mustache.compile('<strong>Legend</strong><ul class="legend">{{#items}}<li><span style="background: {{color}};"></span>{{value}}</li>{{/items}}</ul>'),
	render:function(){
		var vals = this.scale.quantiles().map(function(a,i){return {value:vizes.findWhere({name:$('#whichValue').val()}).get("stringRep")(a),color:colorbrewer.RdYlBu[11][i]}});
		this.$el.html(this.template({items:vals}));
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
	params : function(){
		return {
		"for":'county:*',
		"in":'state:*',
		"key":this.apiKey,
		"get":this.$('option:selected').data('get')
	}},
	events:{
		'change':'valueChange'
	},
	buildValues:function(rows){
		var self=this;
		var vals = [];
		if(rows[0].length===4){
			_.each(rows,function(r){
				var val = parseFloat(r[0],10);
				self.obj[r[2]+r[3]]=val;
				if(val){
					vals.push(val);
				}
			});
		}else if(rows[0].length===3){
			_.each(rows,function(r){
			var val = parseFloat(r[0],10);
				self.obj[r[1]+r[2]]=val;
				if(val){
					vals.push(val);
				}
			});
		}
		self.options.legend.scale.domain(vals);
		self.collection.trigger('renderLegend');
	},
	valueChange:function (){
		var self = this;
		$.get(this.urlBase,this.params(),'json').then(function(a){
			var metric = $('#whichValue option:selected').val();
			var transform = vizes.findWhere({name:metric}).get('transform');
			if (transform) {
				self.buildValues( transform(a));
			} else {
				self.buildValues(a);
			}
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
	m.setView([42.076,-71.505], 8);
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
var url = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpeg';
var attributionText = 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
var mapquestSubdomains = '1234';
var optionsObject = {
	attribution : attributionText,
	subdomains : mapquestSubdomains
};
var mq=L.tileLayer(url, optionsObject).addTo(m);
var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',{attribution:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'});
var layerControl = L.control.layers({"Stamen Watercolor":watercolor,"Map Quest Open":mq}).addTo(m);

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
		this.rt.geoJSON(topojson.feature(data,data.objects.counties),function(err,data){
			if(!err){
				cb(true);
			}
		})
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
		if(polys.obj[id]){
			out.push(polys.current()+': '+polys.obj[id].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		}
		l.bindPopup(out.join("<br />"));
	},style:function(f){
		var id=f.id.toString(10);
		if(id.length === 4){
			id = '0'+id;
		}
		if(polys.obj[id]){
			return {fillColor:colorbrewer.RdYlBu[11][legend.scale(polys.obj[id])],weight:0,fillOpacity:0.8};
		}else{
			return {stroke:false,fill:false};
		}
	}
}).addTo(m);
//add it to the map
layerControl.addOverlay(counties,"Counties");

//download data to start us off
$.when($.ajax('json/us-10m.json'),$.ajax({url:polys.urlBase,data:polys.params(),dataType:'jsonp',jsonp:'jsonp',cache:true})).then(function(a,b){
	vizes.data = a[0];
	var rows = b[0];
	polys.buildValues (rows);
	rt.set(vizes.data).then(function(){
		updateMap();
	});
});

m.on("contextmenu moveend",updateMap);
function updateMap(){
	var bounds = m.getBounds();
	rt.bbox(
		[
			[bounds.getSouthWest().lng,bounds.getSouthWest().lat],
			[bounds.getNorthEast().lng,bounds.getNorthEast().lat]
		]
	).then(function(rData){
		counties.clearLayers();
		counties.addData(rData);
	});
}