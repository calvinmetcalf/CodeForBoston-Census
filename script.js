var apiKey = '0a6b68796bfcfe694987a9ddf3eddd1b735dcd7f';
var urlBase = 'http://api.census.gov/data/2011/acs5';
var current = $('#whichValue').val();
var params = {
	"for":'county:*',
	"in":'state:*',
	"key":apiKey,
	"get":$('#whichValue option:selected').data('get')
}
$('#whichValue').on('change',function(){
	current = $('#whichValue').val();
	$.get(urlBase,{
	"key":apiKey,
	"get":$('#whichValue option:selected').data('get'),
	"for":'county:*',
	"in":'state:*'
	},'json').then(function(a){
		var metric = $('#whichValue option:selected').val();
		var transform = vizes.findWhere({name:metric}).get('transform');
		if (transform) {
			buildValues(data, transform(a));
		} else {
			buildValues(data, a);
		}
		showAll();
	});
});
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
var legend= new Legend({el:$('#legend')});
var url = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpeg';

var attributionText = 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

var mapquestSubdomains = '1234';

var optionsObject = {
	attribution : attributionText,
	subdomains : mapquestSubdomains
};

var mq=L.tileLayer(url, optionsObject).addTo(m);
var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',{attribution:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'});
var data;
var rt = makeRT({
	initialize:function(){importScripts('js/rtree.js','js/topojson.js');this.rt=rTree()},
	set:function(data,cb){this.rt.geoJSON(topojson.feature(data,data.objects.counties),function(err,data){if(!err){cb(true)}})},
	bbox:function(data){return this.rt.bbox(data)}
});
var obj={};
var scale = d3.scale.quantile();
scale.range(d3.range(11));
var layerControl = L.control.layers({"Stamen Watercolor":watercolor,"Map Quest Open":mq}).addTo(m);
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
	//out.push("id: "+id);
		if(obj[id]){
			out.push(current+': '+obj[id].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		
		}
		l.bindPopup(out.join("<br />"));
	
	},style:function(f){
		var id=f.id.toString(10);
	if(id.length === 4){
		id = '0'+id;
	}
	if(obj[id]){
			return {fillColor:colorbrewer.RdYlBu[11][scale(obj[id])],weight:0,fillOpacity:0.8};
	}else{
		return {stroke:false,fill:false};
	}
		
	}
}).addTo(m);
function buildValues (data, rows){
	
var vals = [];
	if(rows[0].length===4){
		_.each(rows,function(r){
			var val = parseFloat(r[0],10);
			obj[r[2]+r[3]]=val;
			if(val){
			vals.push(val);
			}
		});
	}else if(rows[0].length===3){
		_.each(rows,function(r){
		var val = parseFloat(r[0],10);
			obj[r[1]+r[2]]=val;
			if(val){
			vals.push(val);
			}
		});
	}
	scale.domain(vals);
	legend.render();
}
	layerControl.addOverlay(counties,"Counties");
//m.addHash({lc:layerControl});
$.when($.ajax('json/us-10m.json'),$.ajax({url:urlBase,data:params,dataType:'jsonp',jsonp:'jsonp',cache:true})).then(function(a,b){
	data = a[0];
	var rows = b[0];
	buildValues (data, rows);
	
	rt.set(data).then(function(){
	
			showAll();
	
	});
});

m.on("contextmenu moveend",showAll);
function showAll(){
	
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



