var items=[
	{
		name:"Below Poverty Line",
		tables:"B17001_002E,B17001_001E",
		translate:function(a){
			return [parseFloat(a[0])*100 / parseFloat(a[1]), a[2], a[3]]
		},
		stringRep:function(a){
			return  parseFloat(a,10).toPrecision(4) +"%";
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [parseFloat(a[i][0])*100 / parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	},{
		name:"Median Household Income",
		tables:"B19013_001E",
		flip:true,
		stringRep:function(a){
				return  "$"+parseInt(a,10).toString(10).replace(/([0-9]+?)([0-9]{3})(?=.*?\.|$)/mg, "$1,$2");
			}
		
	},{
		name:"Per capita income",
		tables:"B19301_001E",
		flip:true,
		stringRep:function(a){
				return  "$"+parseInt(a,10).toString(10).replace(/([0-9]+?)([0-9]{3})(?=.*?\.|$)/mg, "$1,$2");
			}
		
	},{
		name:"Inequality",
		tables:"B19083_001E",
		stringRep:function(a){
			return  parseFloat(a,10).toPrecision(4);
		}
	},{
		name:"Avg Commute (One Way)",
		tables:"B08131_001E,B08122_001E",
		translate:function(a){
			return [parseFloat(a[0]) / parseFloat(a[1]), a[2], a[3]];
		},
		transform: function(a) {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [parseFloat(a[i][0]) / parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	},{
		name:"Income Car Vs Trans",
		tables:"B08121_002E,B08121_004E",
		translate:function(a){
			return [parseFloat(a[0]) - parseFloat(a[1]), a[2], a[3]];
		},
		transform:function(a) {
			var b = [],i,ct,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [parseFloat(a[i][0]) - parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		},
		flip:true,
		stringRep:function(a){
				return  "$"+parseInt(a,10).toString(10).replace(/([0-9]+?)([0-9]{3})(?=.*?\.|$)/mg, "$1,$2");
			}
	},{
		name: "On Foodstamps",
		tables:"B22007_002E,B22007_001E",
		translate:function(a){
			return [parseFloat(a[0])*100 / parseFloat(a[1]), a[2], a[3]];
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [parseFloat(a[i][0])*100 / parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		},stringRep:function(a){
			return  parseFloat(a,10).toPrecision(4)+"%";
		}
	},{
		name:"Population",
		tables:"B01001_001E"
	},{
		name:"Most Welsh (Welsh per 10,000)",
		tables:"B04001_093E,B04001_001E",
		translate:function(a){
			return [parseFloat(a[0])*10000 / parseFloat(a[1]), a[2], a[3]];
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [parseFloat(a[i][0])*10000 / parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		},
		flip:true
	},
	{
		name:"LPM (Luxemburger Per Million)",
		tables:"B04001_054E,B04001_001E",
		translate:function(a){
			return [parseFloat(a[0])*1000000 / parseFloat(a[1]), a[2], a[3]];
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [parseFloat(a[i][0])*1000000 / parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		},
		flip:true
	},{
		name:"Gender Ratio (Men per 100 Women)",
		tables:"B01001_002E,B01001_026E",
		translate:function(a){
			return [parseFloat(a[0])*100 / parseFloat(a[1]), a[2], a[3]];
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [parseFloat(a[i][0])*100 / parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	},{
		name:"Gender Wage Ratio (Female Wages per $100 Male)",
		tables:"B20002_002E,B20002_003E",
		translate:function(a){
			return [parseFloat(a[1])*100 / parseFloat(a[0]), a[2], a[3]];
		},
		flip:true,
		stringRep:function(a){
			return  "$"+parseFloat(a,10).toPrecision(4);
		}
	},{
		name:"Veteran Wage Ratio (Veteran Wages per $100 Nonveteran)",
		tables:"B21004_007E,B21004_004E",
		translate:function(a){
			return [parseFloat(a[1])*100 / parseFloat(a[0]), a[2], a[3]];
		},
		flip:true,
		stringRep:function(a){
			return  "$"+parseFloat(a,10).toPrecision(4);
		}
	},{
		name:"Moved in Last Year",
		tables:"B07001_001E,B07001_017E",
		
		translate:function(a){
			return [ (parseFloat(a[0])-parseFloat(a[1]))*100 / parseFloat(a[0]), a[2], a[3]]; 
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ (parseFloat(a[i][0])-parseFloat(a[i][1]))*100 / parseFloat(a[i][0]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		},stringRep:function(a){
			return  parseFloat(a,10).toPrecision(4)+"%";
		}
	},{
		name:"Didn't Graduate HS",
		tables:"B06009_002E,B06009_001E",
		translate:function(a){
			return [ parseFloat(a[0])*100 / parseFloat(a[1]), a[2], a[3]]; 
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ parseFloat(a[i][0])*100 / parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		},stringRep:function(a){
			return  parseFloat(a,10).toPrecision(4)+"%";
		}
	},{
		name:"Rent as Percentage of Income",
		tables:"B25071_001E",
		stringRep:function(a){
			return  parseFloat(a,10).toPrecision(4)+"%";
		}
		
	},{
		name:'Rooms per House',
		tables:"B25018_001E",
		stringRep:function(a){
			return parseFloat(a,10).toPrecision(2).replace(/([0-9]+?)([0-9]{3})(?=.*?\.|$)/mg, "$1,$2");
		},
		flip:true
	},{
		name:"Age of Structures (years)",
		tables:"B25035_001E",
		translate:function(a){
			return [ (new Date()).getFullYear()-parseFloat(a[0]), a[1], a[2]];
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			var currentYear = (new Date()).getFullYear();
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ currentYear-parseFloat(a[i][0]), a[i][1], a[i][2]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		},
		flip:true
	},{
		name:"Houses Without Bathrooms (Per 10000)",
		tables:"B25048_003E,B25048_001E",
		translate:function(a){
			return [ parseFloat(a[0])*10000/ parseFloat(a[1]), a[2], a[3]]; 
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ parseFloat(a[i][0])*10000 / parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	},{
		name:"Avg Hours Worked",
		tables:"B23020_001E",
		stringRep:function(a){
			return parseFloat(a,10).toPrecision(4).replace(/([0-9]+?)([0-9]{3})(?=.*?\.|$)/mg, "$1,$2");
		}
	},{
		name:"Whitest (White People per 10k)",
		tables:"B02001_002E,B02001_001E",
		translate:function(a){
			return [ parseFloat(a[0])*10000/ parseFloat(a[1]), a[2], a[3]]; 
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ parseFloat(a[i][0])*10000/ parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	},{
		name:"Blackest (Black People per 10k)",
		tables:"B02001_003E,B02001_001E",
		translate:function(a){
			return [ parseFloat(a[0])*10000/ parseFloat(a[1]), a[2], a[3]]; 
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ parseFloat(a[i][0])*10000/ parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	},{
		name:"Asians per 10K",
		tables:"B02001_005E,B02001_001E",
		translate:function(a){
			return [ parseFloat(a[0])*10000/ parseFloat(a[1]), a[2], a[3]]; 
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ parseFloat(a[i][0])*10000/ parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	},{
		name:"Native American per 10K",
		tables:"B02001_004E,B02001_001E",
		translate:function(a){
			return [ parseFloat(a[0])*10000/ parseFloat(a[1]), a[2], a[3]]; 
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ parseFloat(a[i][0])*10000/ parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	},{
		name:"Mixed Race People per 10K",
		tables:"B02001_008E,B02001_001E",
		translate:function(a){
			return [ parseFloat(a[0])*10000/ parseFloat(a[1]), a[2], a[3]];
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ parseFloat(a[i][0])*10000/ parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	},{
		name:"Non Existent Nationalities (Czechoslovakian, Yugoslavian, and Soviet Union per 100K)",
		tables:"B04001_107E,B04001_032E,B04001_072E,B04001_001E",
		translate:function(a){
			return [ (parseFloat(a[0])+parseFloat(a[1])+parseFloat(a[2]))*100000/ parseFloat(a[3]), a[4], a[5]];
		},
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ (parseFloat(a[i][0])+parseFloat(a[i][1])+parseFloat(a[i][2]))*100000/ parseFloat(a[i][3]), a[i][4], a[i][5]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	},{
		name:"Working Retail",
		tables:"C24070_001E,C24070_006E",
		translate:function(a){
			return [parseFloat(a[1])*100 / parseFloat(a[0]), a[2], a[3]];
		},
		stringRep:function(a){
			return  parseFloat(a,10).toPrecision(4)+"%";
		}
	},{
		name:"Women Working per 100 Men",
		tables:"C24030_002E,C24030_029E",
		translate:function(a){
			return [parseFloat(a[1])*100 / parseFloat(a[0]), a[2], a[3]];
		}
	},{
		name:"Families with More then 5 Kids",
		tables:"B11016_002E,B11016_008E",
		translate:function(a){
			return [parseFloat(a[1])*100 / parseFloat(a[0]), a[2], a[3]];
		},
		stringRep:function(a){
			return  parseFloat(a,10).toPrecision(4)+"%";
		}
	},{
		name:"Median Age Commuting On public transport",
		tables:"B08103_004E"
	},{
		name:"Median Age Commuting Via Car",
		tables:"B08103_002E"
	}
];
if(typeof module !== 'undefined'){
	module.exports = items;
}