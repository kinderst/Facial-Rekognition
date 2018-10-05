import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
//import UploadImage from './UploadImage.js';
import Header from './Header';
import MainContent from './MainContent';
var AWS = require('aws-sdk/dist/aws-sdk-react-native');
//import Footer from './Footer';

//Took footer out because its annoying and useless
class App extends Component {
	constructor() {
    	super();
    	//If the access key and secret key are
    	//set in session storage (logged in)
    	//set the rekognition object and set to state
    	if (sessionStorage.getItem("accesskey") && sessionStorage.getItem("secretkey")) {
	        this.state = {
	    		accessKey: sessionStorage.getItem("accesskey"),
	    		secretKey: sessionStorage.getItem("secretkey")
	        }
    	} else {
    		this.state = {
    			accessKey: null,
    			secretKey: null
    		}
    	}
    }

	//Callback function for sign in to set rekognition & key
    handleSignInSubmit = (accessKey, secretKey) => {
		this.setState({
			accessKey: accessKey,
			secretKey: secretKey
		});
	}

	//Callback function for sign out to null rekognition & key
	//Logs out the user by clearing session storage
  	//and updates the state of the top most parent component (App)
  	//to reflect this
	handleLogOut = event => {
		console.log("logging out");
	    console.log(event);
	    sessionStorage.clear();
	    this.setState({
	    	accessKey: null,
	    	secretKey: null
	    });
	}

	render() {
		return (
		  <div className="App">
		    <Header accessKey={this.state.accessKey} handleLogOut={this.handleLogOut} />
		    <MainContent handleSignInSubmit={this.handleSignInSubmit} accessKey={this.state.accessKey} secretKey={this.state.secretKey} />
		  </div>
		);
	}
}

export default App;