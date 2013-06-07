var items=[
	{
		name:"Percent below poverty line",
		tables:"B17001_002E,B17001_001E",
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
		flip:true
		
	},{
		name:"Per capita income",
		tables:"B19301_001E",
		flip:true
		
	},{
		name:"Inequality",
		tables:"B19083_001E",
		stringRep:function(a){
			return  parseFloat(a,10).toPrecision(5);
		}
	},{
		name:"Avg Commute",
		tables:"B08131_001E,B08122_001E",
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
		transform:function(a) {
			var b = [],i,ct,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [parseFloat(a[i][0]) - parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		},
		flip:true
	},{
		name:"Percent on foodstamps",
		tables:"B22007_002E,B22007_001E",
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
		name:"Population",
		tables:"B01001_001E"
	},{
		name:"Most Welsh (Welsh per 10,000)",
		tables:"B04001_093E,B04001_001E",
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
	},{
		name:"Gender Ratio (Men per 100 Women)",
		tables:"B01001_002E,B01001_026E",
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
		name:"Movement (Percent Moved in last year)",
		tables:"B07001_001E,B07001_017E",
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ (parseFloat(a[i][0])-parseFloat(a[i][1]))*100 / parseFloat(a[i][0]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	},{
		name:"Education (Didn't Graduate HS)",
		tables:"B06009_002E,B06009_001E",
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ parseFloat(a[i][0])*100 / parseFloat(a[i][1]), a[i][2], a[i][3]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	},{
		name:"Rent as Percentage of Income",
		tables:"B25071_001E"
		
	},{
		name:'Rooms per House',
		tables:"B25018_001E",
		stringRep:function(a){
			return  parseFloat(a,10).toPrecision(2);
		},
		flip:true
	},{
		name:"Age of Structures (years)",
		tables:"B25035_001E",
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
		}
	},{
		name:"Houses Without Bathrooms (Per 10000)",
		tables:"B25048_003E,B25048_001E",
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
			return  parseFloat(a,10).toPrecision(4);
		}
	},{
		name:"Whitest",
		tables:"B02001_002E,B02001_001E",
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
		name:"Blackest",
		tables:"B02001_003E,B02001_001E",
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
		name:"Most Asian",
		tables:"B02001_005E,B02001_001E",
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
		name:"Most Native American",
		tables:"B02001_004E,B02001_001E",
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
		name:"Most Mixed Race",
		tables:"B02001_008E,B02001_001E",
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
		name:"Non Existent Nationalities (Czechoslovakian plus Yugoslavian)",
		tables:"B04001_107E,B04001_032E,B04001_001E",
		transform:function(a)  {
			var b = [];
			var ct,i,len;
			for (i = 0,len=a.length; i < len; i++) {
				ct = [ (parseFloat(a[i][0])+parseFloat(a[i][1]))*100000/ parseFloat(a[i][2]), a[i][3], a[i][4]];
				ct[0] = ct[0]|0;
				b.push(ct);
			}
			return b;
		}
	}
];
