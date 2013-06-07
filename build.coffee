fs=require 'fs'
UglifyJS = require "uglify-js"

module.exports=()->
	files = ["/js/jquery.min.js","/js/lodash.compat.min.js","/js/backbone.min.js","/js/bootstrap.min.js","/js/d3.min.js"]
	outFiles = files.map((f)-> fs.readFileSync( './public'+f,'utf8'))
	toMinify = ["./public/js/leaflet.hash.js","./public/js/leaflet.providers.js","./public/js/style.js","./public/js/mustache.js","./public/js/rtree.js","./public/js/colorbrewer.js","./public/js/topojson.js","./public/js/models.js","./public/js/script.js"]
	minified = toMinify.map((f)-> fs.readFileSync(f,'utf8'))
	fs.writeFileSync './public/js/bundle.js',outFiles.join("\n")+minified.join("\n"),'utf8'
	true