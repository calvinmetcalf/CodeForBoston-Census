/*
 Copyright (c) 2012, Vladimir Agafonkin
 Simplify.js is a high-performance polyline simplification library
 mourner.github.com/simplify-js
*/

(function (module,undefined) {

	"use strict";


	// to suit your point format, run search/replace for '[1]' and '[0]'
	// to switch to 3D, uncomment the lines in the next 2 functions
	// (configurability would draw significant performance overhead)


	function getSquareDistance(p1, p2) { // square distance between 2 points

		var dx = p1[1] - p2[1],
	//	    dz = p1[2] - p2[2],
		    dy = p1[0] - p2[0];

		return dx * dx +
	//	       dz * dz +
		       dy * dy;
	}

	function getSquareSegmentDistance(p, p1, p2) { // square distance from a point to a segment

		var x = p1[1],
		    y = p1[0],
	//	    z = p1[2],

		    dx = p2[1] - x,
		    dy = p2[0] - y,
	//	    dz = p2[2] - z,

		    t;

		if (dx !== 0 || dy !== 0) {

			t = ((p[1] - x) * dx +
	//		     (p[2] - z) * dz +
			     (p[0] - y) * dy) /
			        (dx * dx +
	//		         dz * dz +
			         dy * dy);

			if (t > 1) {
				x = p2[1];
				y = p2[0];
	//			z = p2[2];

			} else if (t > 0) {
				x += dx * t;
				y += dy * t;
	//			z += dz * t;
			}
		}

		dx = p[1] - x;
		dy = p[0] - y;
	//	dz = p[2] - z;

		return dx * dx +
	//	       dz * dz +
		       dy * dy;
	}

	// the rest of the code doesn't care for the point format


	function simplifyRadialDistance(points, sqTolerance) { // distance-based simplification

		var i,
		    len = points.length,
		    point,
		    prevPoint = points[0],
		    newPoints = [prevPoint];

		for (i = 1; i < len; i++) {
			point = points[i];

			if (getSquareDistance(point, prevPoint) > sqTolerance) {
				newPoints.push(point);
				prevPoint = point;
			}
		}

		if (prevPoint !== point) {
			newPoints.push(point);
		}

		return newPoints;
	}


	// simplification using optimized Douglas-Peucker algorithm with recursion elimination

	function simplifyDouglasPeucker(points, sqTolerance) {

		var len = points.length,

		    MarkerArray = (typeof Uint8Array !== undefined + '')
		                ? Uint8Array
		                : Array,

		    markers = new MarkerArray(len),

		    first = 0,
		    last  = len - 1,

		    i,
		    maxSqDist,
		    sqDist,
		    index,

		    firstStack = [],
		    lastStack  = [],

		    newPoints  = [];

		markers[first] = markers[last] = 1;

		while (last) {

			maxSqDist = 0;

			for (i = first + 1; i < last; i++) {
				sqDist = getSquareSegmentDistance(points[i], points[first], points[last]);

				if (sqDist > maxSqDist) {
					index = i;
					maxSqDist = sqDist;
				}
			}

			if (maxSqDist > sqTolerance) {
				markers[index] = 1;

				firstStack.push(first);
				lastStack.push(index);

				firstStack.push(index);
				lastStack.push(last);
			}

			first = firstStack.pop();
			last = lastStack.pop();
		}

		for (i = 0; i < len; i++) {
			if (markers[i]) {
				newPoints.push(points[i]);
			}
		}

		return newPoints;
	}

	module.simplify = function (points, tolerance, highestQuality) {

		var sqTolerance = (tolerance !== undefined)
		                ? tolerance * tolerance
		                : 1;

		if (!highestQuality) {
			points = simplifyRadialDistance(points, sqTolerance);
		}
		points = simplifyDouglasPeucker(points, sqTolerance);

		return points;
	};

}(this));

var makeSimp = function(geoJson, level, res){
	var i = 0;
	var len = geoJson.features.length;
	var out = {"type":"FeatureCollection","features":new Array(len)};
	while(i<len){
		out.features[i]=process(geoJson.features[i],level);
		i++;
	}
	return out;
};

function process(feature, level){
	var out = {};
	out.type = feature.type;
	out.properties=feature.properties;
	out.geometry = {};
	var len,i;
	if(feature.geometry.type === "LineString"){
		out.geometry.type = "LineString";
		out.geometry.coordinates = simplify(feature.geometry.coordinates,level);
	}else if(feature.geometry.type === "MultiLineString"){
		out.geometry.type = "MultiLineString";
		i=0;
		len = feature.geometry.coordinates.length;
		out.geometry.coordinates = new Array(len);
		while(i<len){
			out.geometry.coordinates[i]=simplify(feature.geometry.coordinates[i],level);
			i++;
		}
	}
	return out;
}

