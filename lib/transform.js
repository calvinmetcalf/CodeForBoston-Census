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
		var ky;
		var nomens= v.name.split(".").map(function(vv){
			return vv.trim();
		});
		if(nomens[0].slice(-1).match(/[0-9]/)){
			if(!outObj[nomens[0]]){
				outObj[nomens[0]]=v.variables;
			}else{
				for(ky in v.variables){
					outObj[nomens[0]]=v.variables[ky];
				}
			}
			outObj[nomens[0]].name=nomens[1];
			
		}else{
			if(!outObj[nomens[0].slice(0,-1)]){
				outObj[nomens[0].slice(0,-1)]={};
			}
			outObj[nomens[0].slice(0,-1)][nomens[1]]=v.variables;
			outObj[nomens[0].slice(0,-1)][nomens[1]].name=nomens[0];
		}
	});
	function cleaning(v){
		var oot = {},key,value,name;
		for(key in v){
			value=v[key];
			if(key === 'concept'){
				continue;
			}
			if(typeof value==="string"){
				if(key==="name" && value.indexOf("_")>-1){
					oot.Total=value;
				}else{
					oot[key]=value;
				}
			}else{
				oot[key]=cleaning(value);
			}
		}
		if(Object.keys(oot).length===1){
			return oot.name||oot.Total;
		}
		return oot;
	}
	var finOut = {},keyzi;
	for(keyzi in outObj){
		name = outObj[keyzi].name;
		outObj[keyzi].name=keyzi;
		finOut[name]=cleaning(outObj[keyzi]);
	}
	return finOut;
};