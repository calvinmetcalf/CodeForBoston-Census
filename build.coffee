fs=require 'fs'
UglifyJS = require "uglify-js"
request = require 'request'
items = require './public/js/models'
things=(thing,cb)->
	files = ["/js/jquery.min.js","/js/lodash.compat.min.js","/js/backbone.min.js","/js/bootstrap.min.js","/js/d3.min.js"]
	outFiles = files.map((f)-> fs.readFileSync( './public'+f,'utf8'))
	outFiles.push thing
	toMinify = ["./public/js/leaflet.hash.js","./public/js/leaflet.providers.js","./public/js/style.js","./public/js/mustache.js","./public/js/rtree.js","./public/js/colorbrewer.js","./public/js/topojson.js","./public/js/models.js","./public/js/cNames.js","./public/js/script.js"]
	minified = toMinify.map((f)-> fs.readFileSync(f,'utf8'))
	fs.writeFileSync './public/js/bundle.js',outFiles.join("\n")+minified.join("\n"),'utf8'
	cb true
processTable(table)->
	headRow = table.shift()
	outTable = table.map (row)->
		
module.exports = (cb)->
	keys = Object.keys(items.map((a) ->
			a.tables.split(",")
		).reduce((a,b)->
			b.forEach((bb)->a[bb]=true)
			a
		,{})
		).sort().join(",")
	bigTable = false
	request {
		url : "http://api.census.gov/data/2011/acs5"
		qs :
			'for':'county:*'
			'in':'state:*'
			'key':'0a6b68796bfcfe694987a9ddf3eddd1b735dcd7f'
			'get':keys
		json:true
	}, (e,r,b)->
		out = "var bigTable = #{JSON.stringify(processTable(b))};"
		things out,cb
