var items=[
		{
			name:"Income",
			tables:"B19013_001E"
		},{
			name:"Inequality",
			tables:"B19083_001E"
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
		}
	];
var Viz = Backbone.Model.extend({
	defaults: {
		transform:false
	}
});

var Vizes = Backbone.Collection.extend({
	model:Viz
});

var vizes = new Vizes(items);

var Selctor = Backbone.View.extend({
	el:$('#whichValue'),
	collection:vizes,
	template:Mustache.compile('{{#items}}<option value="{{name}}" data-get="{{tables}}">{{name}}</option>{{/items}}'),
	render:function(){
		this.$el.html(this.template({items:this.collection.toJSON()}));
	}
});
var selctor = new Selctor();
selctor.render();