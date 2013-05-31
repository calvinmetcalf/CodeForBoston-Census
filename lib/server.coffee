express = require 'express'
kublai = express()
kublai.use express.compress()
kublai.use express.favicon('./lib/kublai.ico')
kublai.use express.bodyParser()
kublai.use express.logger('dev') 
kublai.use express.static('./public')
kublai.get '/', (req, res)->
    res.jsonp hello: "there"
kublai.get '/stats', (req, res)->
	numCPUs = require('os').cpus().length
	res.jsonp num : numCPUs
kublai.get '*', (req, res)->
	res.status(404).sendfile('./lib/404.jpg')
int = require './internals.coffee'
int.run(kublai)