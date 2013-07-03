fs=require 'fs'

module.exports=()->
	files = ["/js/jquery.min.js","/js/lodash.compat.min.js","/js/backbone.min.js","/js/bootstrap.min.js","/js/d3.min.js"]
	outFiles = files.map((f)-> fs.readFileSync( '.'+f,'utf8'))
	toMinify = ["./js/leaflet.hash.js","./js/leaflet.providers.js","./js/style.js","./js/mustache.js","./js/rtree.js","./js/colorbrewer.js","./js/spin.js","./js/topojson.js","./script.js"]
	minified = toMinify.map((f)-> fs.readFileSync(f,'utf8'))
	fs.writeFileSync './js/bundle.js',outFiles.join("\n")+minified.join("\n"),'utf8'
	true