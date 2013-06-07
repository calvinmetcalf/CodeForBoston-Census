module.exports = function(docs){
	var docList=docs.apivariables.concept.map(function(v){
		var out = {};
		out.name=v.$.name;
		out.variables = {};
		v.variable.forEach(function(u){
			var key = u._.trim();
			if(key.slice(0,21)==="Margin Of Error For!!"){
				return;
			}
			var split;
			if(key.indexOf("!!")>-1){
				split = key.split("!!");
				if(split[0] in out.variables){
					out.variables[split[0]][split[1]]=u.$;
				}else{
					out.variables[split[0]]={};
					out.variables[split[0]][split[1]]=u.$;
				}
			}else{
				if(key in out.variables){
					out.variables[key].concept = u.$.concept;
					out.variables[key].name= u.$.name;
				}else{
					out.variables[key]=u.$;
				}
			}
	
		},{});
	return out;
	});
	var outObj = {};
	docList.forEach(function(v){
		var nomens= v.name.split(".").map(function(vv){
			return vv.trim();
		});
		if(nomens[0].slice(-1).match(/[0-9]/)){
			if(!outObj[nomens[0]]){
			outObj[nomens[0]]={};
	}
			outObj[nomens[0]].name=nomens[1];
			outObj[nomens[0]].variables=v.variables;
		}else{
			if(!outObj[nomens[0].slice(0,-1)]){
				outObj[nomens[0].slice(0,-1)]={};
			}
			outObj[nomens[0].slice(0,-1)][nomens[0].slice(-1)]={};
			outObj[nomens[0].slice(0,-1)][nomens[0].slice(-1)].name=nomens[1];
			outObj[nomens[0].slice(0,-1)][nomens[0].slice(-1)].variables=v.variables;
		}
	});
	return outObj;
};