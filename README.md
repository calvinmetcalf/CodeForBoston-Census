CodeForBoston-Census
====================

Repo for the census group.

The data views are in the file `js/models.js` to add a new one you need to add another object to the array of the format

```javascript
{
	name:'string',// required 
	tables:'string',//required, one or more seperated by comma (only one string)
	stringRep:function(a){
				return  parseFloat(a,10).toPrecision(5);
			},//optional defaults to this one, how the value is represented.
	transform:'function'//optional if you need to calculate on multiple values
	flip:boolian//optional if the color scheme should be fliped
}
```