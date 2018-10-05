import React, { Component } from 'react';
//import { setRekogObj } from './App.js';

//import { Link } from 'react-router-dom';

import { Button, Glyphicon, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
//import './bootstrap.min.css';
//import "bootstrap/scss/bootstrap.scss";
var AWS = require('aws-sdk/dist/aws-sdk-react-native');

/*
Security Notes

For this application, storing the AWS IAM key and secret
in session storage makes sense. This is because you 
download the access key file, and I assume most people
will have that file saved on your computer anyway, or
when you did save your machine was already compromised
and it was read. So to keep this data off local machine,
even temporary during session, would be more work just
to prevent the people who are hacked from losing their
IAM key. That said, if this website does go fully live,
it would be necessary to implement database with users
and passwords and other secure information such as
their IAM keys they would use on the site, instead of
having this sensitive data being stored in plain text
locally

Right before the API call is made, lets say I just
got key and secret right before I do something from
super secure DB, could hacker not insert a line of js
that logs the key and secret anyway? They can get session
storage if they can do this, too.

THE PROPER way to do this would be to do API calls on
the backend using user data from database retreived
by backend. enter user & pass, request -> server
(api call) -> api. Can't use firebase because keys
could still be read client side if computer hacked

So for now don't worry, and mark this site as insecure
and that is somewhat possible your keys are compromised
if your computer is hacked, but theorhetically secure
otherwise

Access Key ID: <input type="text" name="accessKeyInput" value={this.state.accessKeyInput} onChange={this.handleChange} />
			Secret Access Key: <input type="text" name="secretKeyInput" value={this.state.secretKeyInput} onChange={this.handleChange} />
			<input type="submit" value="Submit" />
*/

class LogInIAM extends Component {
	state = {
		accessKeyInput: '',
		secretKeyInput: ''
	};

	//AccessKeyId notes here:
	//https://docs.aws.amazon.com/IAM/latest/APIReference/API_AccessKey.html
	getAccessKeyValidationState = () => {
		const length = this.state.accessKeyInput.length;
		const value = this.state.accessKeyInput;
		//const regex = new RegExp("^([\w]+)$");
		//regex.test(value)
		if (length >= 16 && length <= 128) {
			return 'success';
		} else {
			return 'error';
		}
		return null;
	}

	//AccessKeyId notes here:
	//https://docs.aws.amazon.com/IAM/latest/APIReference/API_AccessKey.html
	getSecretKeyValidationState = () => {
		const length = this.state.secretKeyInput.length;
		const value = this.state.secretKeyInput;
		if (length >= 8 && length <= 256) {
			return 'success';
		} else {
			return 'error';
		}
		return null;
	}

	handleChange = event => {
		const name = event.target.name;
		const value = event.target.value;
		this.setState({
			[name]: value
		});
	}

	//had to create function that just calls
	//the callback function inside because I don't
	//think event prevent default was working
	formSubmit = event => {
		//prevent page refresh
		event.preventDefault();
		//Test to see if valid account
		//set rekognition object with given user cred's
		var rekognition = setRekogObj(this.state.accessKeyInput, this.state.secretKeyInput);
		var params = {};
		//listCollections does NOT count towards images processed
		rekognition.listCollections(params, (err, data) => {
			if (err) {
				//console.log(err, err.stack);
				alert("Invalid AWS IAM account");
			}
			else {
				//set session storage to user input
				//security note (sessionStorage can be
				//modified by user whenever)
				sessionStorage.setItem("accesskey", this.state.accessKeyInput);
				sessionStorage.setItem("secretkey", this.state.secretKeyInput);
				//callback to parent
				this.props.handleSubmit(this.state.accessKeyInput, this.state.secretKeyInput);
				//Link programmatically
				this.props.history.push('/manage-collections');			
			}
		});
	}

	render() {
		return (
			<div>
				<h2>Enter Your AWS IAM Access Key ID and Secret Access Key</h2>
				<form>
					<FormGroup controlId="accessKeyInput" validationState={this.getAccessKeyValidationState()}>
						<ControlLabel>IAM Access Key ID</ControlLabel>				
						<FormControl type="text" placeholder="heytest" name="accessKeyInput" value={this.state.accessKeyInput} onChange={this.handleChange} />
						<FormControl.Feedback />				
					</FormGroup>
					<FormGroup controlId="secretKeyInput" validationState={this.getSecretKeyValidationState()}>
						<ControlLabel>IAM Secret Access Key</ControlLabel>				
						<FormControl type="text" placeholder="heytest" name="secretKeyInput" value={this.state.secretKeyInput} onChange={this.handleChange} />
						<FormControl.Feedback />				
					</FormGroup>
					<Button type="submit" onClick={this.formSubmit}>Submit</Button>
				</form>
			</div>
		);
	}
}

//function to set the rekognition object securely,
//not necessarily because AWS but because this
//is a place where user input get used in code.
//So it is escapes unnecessary characters and
//makes sure the encoding is proper
export function setRekogObj(accessKey, secretKey) {
	console.log("SETTING REKOG");
	var cleanAccessKey = encodeURI(escape(accessKey));
	var cleanSecretKey = encodeURI(escape(secretKey));
	var rekognition = new AWS.Rekognition({endpoint: 'rekognition.us-east-2.amazonaws.com', region: 'us-east-2', accessKeyId: cleanAccessKey, secretAccessKey: cleanSecretKey});
	return rekognition;
}

export default LogInIAM;