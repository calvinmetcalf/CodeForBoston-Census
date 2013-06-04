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
		tables:"B19013_001E"
		
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
		}
	},{
		name:"Percent on foodstamps",
		tables:"B22007_001E,B01001_001E",
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
