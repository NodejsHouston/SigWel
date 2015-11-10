import React from "react";
import ReactDom from "react-dom";
import 'es6-shim';
import request from "superagent"


export default class Sigwel extends React.Component {
	constructor (props) {
    	super();
    	this._RefSigCollection = [];
    	this._Testsig = {};
    	this.state={
    		TrackX: [],
    		TrackY: [],
    		TrackDrag: []
    		//context:null
    	}
    	this._mouseDownListener = this._mouseDownListener.bind(this);
    	this._mouseUpListener=this._mouseUpListener.bind(this);
    	this._mouseMoveListener=this._mouseMoveListener.bind(this);
    	this._addClick = this._addClick.bind(this);
    	this.AddNewRef = this.AddNewRef.bind(this);
    	this.NewTest = this.NewTest.bind(this);
    	this.PostRef = this.PostRef.bind(this);
    	this.PostTest = this.PostTest.bind(this);


    }

    AddNewRef(){
    	let newtrack ={};
    	newtrack.TrackX=this.state.TrackX;
    	newtrack.TrackY=this.state.TrackY;
    	this._RefSigCollection.push(newtrack);
    }

    NewTest(){
    	this._Testsig.TrackX=this.state.TrackX;
    	this._Testsig.TrackY=this.state.TrackY;

    }

    PostRef(username,email,fn){
        this.AddNewRef();
        console.log(this._RefSigCollection);
    	request.post('http://localhost:3000/api/user/ref/'+username)
                .set('Authorization','qwert')
    			.send({username:username,email:email,data:this._RefSigCollection})
    			.end(fn);
    }

    PostTest(username,email,fn){
    	request.post('http://localhost:3000/api/user/test/'+username)
    			.send({username:username,email:email,data:this._Testsig})
    			.end(fn);
    }


    componentDidMount () {
    let canvasref=this.props.name;
    console.log(canvasref);
    let canvas = ReactDom.findDOMNode(this.refs[canvasref]);
    this.context = canvas.getContext("2d");
    this.context.paint=false;
    //console.log(this.context);
    //console.log(canvas);
	this.listeners = {
      mousemove: e => this._mouseMoveListener(e),
      mouseup: e => this._mouseUpListener(e),
      mousedown: e => this._mouseDownListener(e)
    };
    canvas.addEventListener("mousedown", this.listeners.mousedown, false);
    canvas.addEventListener("mouseup",this.listeners.mouseup,false);
    canvas.addEventListener("mousemove",this.listeners.mousemove,false);

    //this.prepareImage(this.props.image);
	}

	_mouseDownListener(e){
		//var offset = $(this).offset();
		let offsetLeft = this.context.canvas.offsetLeft;
		let offsetTop = this.context.canvas.offsetTop;
		this.context.paint = true;
		this._addClick(Math.floor(e.pageX - offsetLeft), Math.floor(e.pageY - offsetTop), false);

	}

	_mouseMoveListener(e){
		let offsetLeft = this.context.canvas.offsetLeft;
		let offsetTop = this.context.canvas.offsetTop;
		if(this.context.paint)
		this._addClick(Math.floor(e.pageX - offsetLeft), Math.floor(e.pageY - offsetTop), true);
		
	}

	_mouseUpListener(e){
		this.context.paint=false;
	}

    clear(){
        this.setState({
            TrackX: [],
            TrackY: [],
            TrackDrag: []
        });
    }

	 componentDidUpdate(){
    	let context=this.context;
    	let sig=this.state;

    	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    	context.strokeStyle = "#000";
		context.lineJoin = "round";
		context.lineWidth = 4;
    	for (let i = 0; i < sig.TrackX.length; i++) {
			context.beginPath();
			if (sig.TrackDrag[i] && i) {
				context.moveTo(sig.TrackX[i - 1], sig.TrackY[i - 1]);
			} else {
				context.moveTo(sig.TrackX[i] - 1, sig.TrackY[i]);
			}
			context.lineTo(sig.TrackX[i], sig.TrackY[i]);
			context.closePath();
			context.stroke();
		}
    }

	_addClick(x, y, dragging) {
	this.state.TrackX.push(x);
	this.state.TrackY.push(y);
	this.state.TrackDrag.push(dragging);
	this.setState({
			TrackX: this.state.TrackX,
    		TrackY: this.state.TrackY,
    		TrackDrag: this.state.TrackDrag
	});
	}

    render () {
        var instyle={
            cursor:'pointer',
            border:'1px solid red'
        };
    	return (
    		<div className="canvas-bk">
	    		
                <canvas ref={this.props.name} width='400px' height='400px' style={instyle}></canvas>
	    		
    		</div>
		);
	}

}