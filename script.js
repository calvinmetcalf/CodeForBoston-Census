var apiKey = '0a6b68796bfcfe694987a9ddf3eddd1b735dcd7f';
var urlBase = 'http://api.census.gov/data/2011/acs5';
var current = $('#whichValue').val();
var params = {
	"key":apiKey,
	"get":$('#whichValue option:selected').data('get'),
	"for":'county:*',
	"in":'state:*'
}
$('#whichValue').on('change',function(){
	current = $('#whichValue').val();
	$.get(urlBase,{
	"key":apiKey,
	"get":$('#whichValue option:selected').data('get'),
	"for":'county:*',
	"in":'state:*'
},'json').then(function(a){
	buildValues (data, a);
	showAll();
})
});
var m = L.map('map');
//if(!location.hash){
	m.setView([42.076,-71.505], 8)
//};

var url = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpeg';

var attributionText = 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

var mapquestSubdomains = '1234';

var optionsObject = {
	attribution : attributionText,
	subdomains : mapquestSubdomains
}

var mq=L.tileLayer(url, optionsObject).addTo(m);
var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',{attribution:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'});
var data;
var rt = rTree();
var obj={};
var scale = d3.scale.quantile();
scale.range(d3.range(11));
var layerControl = L.control.layers({"Stamen Watercolor":watercolor,"Map Quest Open":mq}).addTo(m);
var counties = L.geoJson({features:[]},{
	onEachFeature:function (f,l){
	var out = [];
	if (f.properties){
		for(key in f.properties){
			out.push(key+": "+f.properties[key]);
		}
		if(obj[f.id]){
			out.push(current+': '+obj[f.id].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
		}
		l.bindPopup(out.join("<br />"));
	}
	},style:function(f){
			return {fillColor:colorbrewer.Spectral[11][scale(obj[f.id])],weight:0,fillOpacity:0.8}
		
	}
}).addTo(m);
function buildValues (data, rows){
var vals = [];
	_.each(rows,function(r){
		var val = parseFloat(r[0],10);
		obj[r[1]+r[2]]=val;
		vals.push(val);
	});
	scale.domain(vals);
}
	layerControl.addOverlay(counties,"Counties");
//m.addHash({lc:layerControl});
$.when($.ajax('json/us-counties.json'),$.get(urlBase,params,'json')).then(function(a,b){
	data = a[0];
	var rows = b[0];
	buildValues (data, rows)
	
	rt.geoJSON(data,function(err,success){
		if(!err){
			showAll();
		}
	});
});

m.on("contextmenu moveend",showAll);
function showAll(){
	counties.clearLayers();
	var bounds = m.getBounds();
	counties.addData(
		rt.bbox(
			[
				[bounds.getSouthWest().lng,bounds.getSouthWest().lat],
				[bounds.getNorthEast().lng,bounds.getNorthEast().lat]
			]
		)
	);
}

