express = require 'express'
fs = require 'fs'
request = require 'request'
redis = require "redis"
xml2js = require 'xml2js'
parser = new xml2js.Parser()
index=fs.readFileSync './index.html','utf8'
transform = require './transform'
models = require '../public/js/models'
kublai = express()
kublai.use express.compress()
kublai.use express.favicon('./lib/kublai.ico')
kublai.use express.bodyParser()
kublai.use express.logger('dev') 
#kublai.use(require('less-middleware')({ src: './public/style' }))
kublai.use express.static('./public')
client = redis.createClient 10896,'dory.redistogo.com'
client.auth 'c6ce6017ecd73bdbcbc23b1a1838919f'

#kublai.set 'json spaces',0
kublai.get '/data/:year/:set/counties/:tables', (req,res)->
	res.header "Access-Control-Allow-Origin", "*"
	res.header "Access-Control-Allow-Headers", "X-Requested-With"
	client.get req.params.tables, (err,tables)->
		if tables
			res.jsonp(JSON.parse(tables))
		else
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
				client.set req.params.tables, JSON.stringify(b)
				res.jsonp b
kublai.get '/data/:view', (req,res)->
	res.header "Access-Control-Allow-Origin", "*"
	res.header "Access-Control-Allow-Headers", "X-Requested-With"
	key = req.params.view.replace /-/g," "
	model = models.filter((m)->
		return m.name==key)[0]
	#console.log model
	client.get key, (err,data)->
		if data
			res.jsonp(JSON.parse(data))
		else
			qs = 
				'for':'county:*'
				'in':'state:*'
				'key':'0a6b68796bfcfe694987a9ddf3eddd1b735dcd7f'
				'get':model.tables
			request {
				url:"http://api.census.gov/data/2011/acs5"
				qs:qs
				json:true
			},(e,r,b)->
				o = [{},[]]
				b.forEach (oRow)->
					if model.translate
						row = model.translate(oRow)
					else
						row = oRow
					val = parseFloat(row[0],10)
					o[0][row[1]+row[2]]=val
					o[1].push(val) if val
				client.set key, JSON.stringify(o)
				res.jsonp o
kublai.get '/docs/:year/:set',(req,res)->
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
