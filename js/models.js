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
		name:"Income",
		tables:"B19013_001E",
		flip:true
		
	},{
		name:"Inequality",
		tables:"B19083_001E",
		stringRep:function(a){
			return  parseFloat(a,10).toPrecision(5);
		}
	},{
		name:"Mean Commute",
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
		name:"Gender Ratio",
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
	}
];
