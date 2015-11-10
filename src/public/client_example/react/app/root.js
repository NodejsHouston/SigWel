import React from 'react';
import Sigwel from './sigwel.js';

export default class Root extends React.Component {
	constructor(props) {
		super(props);
		this.handlePostRef = this.handlePostRef.bind(this);
		this.handlePostTest = this. handlePostTest.bind(this);
		this.handleNext = this.handleNext.bind(this);
		

	}

	handlePostRef(){
		//console.log(this.refs.sigwel);
		//console.log(this.refs.sigwel.AddnewTrack());
		this.username = 'ReactUser'+Date.now().toString();
		this.email = this.username+'@ReactTest.co'
		this.refs.sigwelref.PostRef(this.username,this.email,function(err,res){
			console.log(res.body);
		});
	}

	handlePostTest(){
		this.refs.sigweltest.NewTest();
		this.refs.sigweltest.PostTest(this.username,this.email,function(err,res){
			console.log(res.body);
		});

	}

	handleNext(){
		this.refs.sigwelref.AddNewRef();
		this.refs.sigwelref.clear();	
	}

	render(){
		return(
			<div>
			<div>Please Provide Reference Signatures</div>
			<Sigwel ref='sigwelref' name="ref"/>
			
			<input type='button' onClick={this.handlePostRef} value="Submit Ref"/>
			<input type='button' onClick={this.handleNext} value="Next One"/>
			<div>Please Provide Test Signature</div>
			<Sigwel ref='sigweltest' name="test"/>
			<input type='button' onClick={this.handlePostTest} value="Submit Test"/>
			
			</div>
			);
	}	

}