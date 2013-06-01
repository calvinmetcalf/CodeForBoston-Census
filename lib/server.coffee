express = require 'express'
mustache = require 'mustache'
fs = require 'fs'
kublai = express()
kublai.use express.compress()
kublai.use express.favicon('./lib/kublai.ico')
kublai.use express.bodyParser()
kublai.use express.logger('dev') 
kublai.use(require('less-middleware')({ src: './public' }))
kublai.use express.static('./public')
templates = {}
fs.readFile './views/layout.html', 'utf8', (err,resp)->
	unless err
		templates.layout=mustache.compile(resp)
		true
fs.readdir './views/partials',(err,paths)->
	paths.forEach (path)->
		fs.readFile "./views/partials/#{path}",  'utf8',(err,resp)->
			mustache.compilePartial path.slice(0,-5), resp
navBar =
	home:{address:'#',name:'Home'}
	about:{address:'#about',name:'About'}
	projects:{address:'#projects',name:'Projects'}
	bio:{address:'#bio',name:'Bio'}
getNavBar = (title)->
	for key, value of navBar
		if key is title
			newVal = value
			newVal.active = true
			newVal
		else
			value
	
kublai.get '/', (req, res)->
	cont = '<h1>Bootstrap starter template</h1><p>Use this document as a way to quick start any new project.<br> All you get is this message and a barebones HTML document.</p>'
	res.send templates.layout 
		content : cont
		nav : getNavBar('projects')
		title : 'Calvin!'
kublai.get '/stats', (req, res)->
	numCPUs = require('os').cpus().length
	res.jsonp num : numCPUs
kublai.get '*', (req, res)->
	res.status(404).sendfile('./lib/404.jpg')
int = require './internals.coffee'
int.run(kublai)