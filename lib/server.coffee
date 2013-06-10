express = require 'express'
fs = require 'fs'
request = require 'request'
xml2js = require 'xml2js'
parser = new xml2js.Parser()
index=fs.readFileSync './index.html','utf8'
docs={'2011':{'counties':{}},'2010':{'counties':{}}}
transform = require './transform'
kublai = express()
kublai.use express.compress()
kublai.use express.favicon('./lib/kublai.ico')
kublai.use express.bodyParser()
kublai.use express.logger('dev') 
#kublai.use(require('less-middleware')({ src: './public/style' }))
kublai.use express.static('./public')



#kublai.set 'json spaces',0
kublai.get '/data/:year/:set/counties/:tables', (req,res)->
	if docs[req.params.year].counties[req.params.tables]
		res.jsonp docs[req.params.year].counties[req.params.tables]
		return true
	qs = 
		'for':'county:*'
		'in':'state:*'
		'key':'0a6b68796bfcfe694987a9ddf3eddd1b735dcd7f'
		'get':req.params.tables
	request {
		url:"http://api.census.gov/data/#{req.params.year}/#{req.params.set}"
		qs:qs
		json:true
	},(e,r,b)->
		docs[req.params.year].counties[req.params.tables]=b
		res.jsonp b
kublai.get '/docs/:year/:set',(req,res)->
	if docs[req.params.year][req.params.set]
		res.jsonp docs[req.params.year][req.params.set]
	else
		request "http://www.census.gov/developers/data/#{req.params.set.slice(0,3)}_#{req.params.set.slice(-1)}yr_#{req.params.year}_var.xml",(e,r,b)->
			unless e
				parser.parseString b, (err,result)->
					unless err
						out = transform result
						docs[req.params.year][req.params.set]=out
						res.jsonp(out)
kublai.get '/', (req,res)->
	res.send index
kublai.get '/:name', (req, res)->
	res.send index
kublai.get '*', (req, res)->
	res.status(404).sendfile('./lib/404.jpg')
int = require './internals.coffee'
int.run(kublai)
