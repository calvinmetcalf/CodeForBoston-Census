var apiKey = '0a6b68796bfcfe694987a9ddf3eddd1b735dcd7f';


var m = L.map('map').setView([37.13, -80.33], 4);
var url = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpeg';

var attributionText = 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

var mapquestSubdomains = '1234';

var optionsObject = {
    attribution : attributionText,
    subdomains : mapquestSubdomains
}

var mq=L.tileLayer(url, optionsObject);
var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',{attribution:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
watercolor.addTo(m);




var layerControl = L.control.layers({"Stamen Watercolor":watercolor,"Map Quest Open":mq}).addTo(m);
