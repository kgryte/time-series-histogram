/**
*
*
*
*
*	NOTES:
*		- getEdges:
*			- Precision errors when calculating the edges
*
*
*
*/



(function() {
	'use strict';


	// VARIABLES:

	var min = 0,
		max = 1,
		binWidth = 0.05,

		edges,
		hist;



	// Get the histogram edges:
	edges = getEdges( min, max, binWidth );

	d3.json('data/data.json', function(error, data) {

		// Calculate the histogram:
		hist = histogram( data, edges );

		console.log(data, edges, hist);

	});

	



	function getEdges( min, max, binWidth ) {
		// 
		// NOTES:
		//	- constant bin width
		//

		var edges = [],
			numEdges = (max - min) / binWidth + 1;

		edges[0] = min;
		edges[numEdges-1] = max;

		for (var i = 1; i < numEdges-1; i++) {
			edges[i] = min + binWidth*i;
		}

		return edges;

	} // end FUNCTION getEdges()


	

	function histogram(vector, edges) {
		//
		// vector:
		//

		var id,

			bins = [],
			counts = [];

		// Initialize our counts vector: (all zeros)
		for ( var i = -1; i < edges.length; i++ ) {
			counts[i+1] = 0;
		} // end FOR i

		// For each value in the vector, find where the value resides along the cumulative:
		for ( var j = 0; j < vector.length; j++ ) {

			// Perform a binary search to find the index where the value equals or exceeds the corresponding value in the cumulative:
			id = binarysearch( edges, vector[j] );

			// Store that id in our bins array, allowing us to keep track of the bin in which a particular vector point falls:
			bins.push( id );

			// Update the counts for a bin:
			counts[id+1] += 1;

		} // end FOR i

		// Return the histogram results:
		return {
			'bins': bins,
			'counts': counts
		};


	} // end FUNCTION histogram()


	function binarysearch( vector, value ) {
		//
		//	NOTES:
		//		- This is a variation of the binary search algorithm, in which we are not seeking equality, per se, but to find that index at which the supplied value equals or exceeds the value at that index but is less than the value at the next index. We are looking for the right 'bin'.
		//

		var lower = 0,
			upper = vector.length,
			id;

		// Initial checks:
		if ( value < vector[ lower ] ) {
			// Value is below the lower bound:
			return -1;
		} // end IF
		if ( value > vector[ upper-1 ] ) {
			//  Value exceeds the upper bound:
			return upper-1;
		} // end IF

		// We know that the value resides somewhere within our vector...okay to proceed:

		// console.log(lower, id, upper);
		while ( lower <= upper ) {

			// Use a bitwise operator to return: Math.floor( (lower + upper) / 2), which is the middle value:
			id = (lower + upper) >> 1;

			// If the value is greater than the mid point, increase our lower bound index:
			if (value > vector[ id ]) {
				lower = id + 1;
			} else {
			// Does the value equal the upper bound? If yes, exit the loop; else decrement our lower bound index and tighten the bounds:
				upper = ( value === vector[ id ] ) ? -2 : id - 1;
			}

			// console.log(lower, id, upper);

		}

		// Recall the following: 1) if a perfect match has been found, then upper is -2 and the current id is the upper bound at which the match occurred. In this case, we want to return that id. 2) if a perfect match has not been found, we have two scenarios: i) if the value is less than the value at the upper bound index, we want the previous id. ii) if the value is greater than or equal to the value at the upper bound index, we found our id.
		return ( value < vector[id] ) ? id-1 : id;

	} // end FUNCTION binary_search()


})();