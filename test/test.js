var vector = require('../src/server/lib/vector'),
	util = require('../src/server/lib/util'),
	chai = require('chai'),
	expect = chai.expect;

chai.should();

describe('Vector deduplication', function(){

	it('it should reduce deduplication points', function(){
		//reduce conceutive points with same coordinate
		var v = new vector([[3,8,8,9,9,0,3],[3,4,4,8,8,4,3]]);
		v.Deduplication().GetValue().should.be.eql([[3,8,9,0,3],[3,4,8,4,3]]);

	});
	
	it('it should also work for 3-D vector', function(){
		var v = new vector([[4,6,2,2,5,1,1],[3,8,1,1,4,2,2],[9,4,6,6,8,9,9]]);
		v.Deduplication().GetValue().should.be.eql([[4,6,2,5,1],[3,8,1,4,2],[9,4,6,8,9]]);
	})

});

describe('Vector CompareDelta',function(){
	it('it should count the diffrence between two conceutive points',function(){
		var v = new vector([[4,7,3,2,5,6,9],[5,6,3,2,8,0,1]]);
		v.CompareDelta().GetValue().should.be.eql([[3,-4,-1,3,1,3],[1,-3,-1,6,-8,1]]);
	})
});

describe('Vector DWT', function(){
	it('it should be 0 when test array and ref array are the same',function(){
		var ref = [[4,-2,3,5,2,-1],[2,3,-1,-4,0,1]];
		var test = [[4,-2,3,5,2,-1],[2,3,-1,-4,0,1]];
		vector.DWT(ref,test).should.be.equal(0);
	});

	it('it should count the minimum distance between test array and ref array properly',function(){
		// ref is a curve that represent "down-top-down"
		var ref = [[1,2,3,3,2,1,1],[1,4,9,-1,-9,-4,-1]];
		var test1 = [[2,2,2,2,2,2,2],[0,1,2,-1,-1,0,0]];
		var test2 = [[1,1,2,2,1,1],[2,5,8,-3,-8,-2]];
		var ref_test1 = vector.DWT(ref,test1);
		vector.DWT(ref,test2).should.be.below(ref_test1);
	})
});


