express = require 'express'
fs = require 'fs'
request = require 'request'
index=fs.readFileSync './index.html','utf8'
kublai = express()
kublai.use express.compress()
kublai.use express.favicon('./lib/kublai.ico')
kublai.use express.bodyParser()
kublai.use express.logger('dev') 
kublai.use(require('less-middleware')({ src: './public/style' }))
kublai.use express.static('./public')
kublai.get '/data/:year/:set', (req,res)->
	request(
		url:"http://api.census.gov/data/#{req.params.year}/#{req.params.set}"
		qs:req.query
		).pipe res
kublai.get '/', (req,res)->
	res.send index
kublai.get '/:name', (req, res)->
	res.send index
kublai.get '*', (req, res)->
	res.status(404).sendfile('./lib/404.jpg')
int = require './internals.coffee'
int.run(kublai)