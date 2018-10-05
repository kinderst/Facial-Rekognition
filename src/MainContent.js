import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LogInIAM from './LogInIAM';
import RekogConsole from './RekogConsole';
import ManageCollections from './ManageCollections.js';
import ManageCollection from './ManageCollection.js';
import { setRekogObj } from './LogInIAM.js';

var AWS = require('aws-sdk/dist/aws-sdk-react-native');

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
//<Route path='/allunique' component={AllUnique}/>
//<Route path='/login' component={LogInIAM}/>
//<Route exact path='/console' component={RekogConsole}/>
class MainContent extends Component {

	constructor(props) {
		super(props);
		//If the access key and secret key are
    	//set in session storage (logged in)
    	//set the rekognition object and set to state
    	if (props.accessKey && props.secretKey) {
    		console.log("maincontent logged in");
			let rekognition = setRekogObj(props.accessKey, props.secretKey);
			//not an API call technically, just setting API object, 
			//so do in constructor. Neither is getting local storage,
			//though if I had to query a database I would treat like
			//API call, and normally do API calls in component did mount.
			this.state = {
				accessKey: props.accessKey,
				secretKey: props.secretKey,
				rekognition: rekognition,
				collectionsData: null
			};
		} else { //not logged in
			this.state = {
				accessKey: null,
				secretKey: null,
				rekognition: null,
				collectionsData: null
			};
		}
	}

	/*
	If local storage ever gets put into a database that
	would be queried, I would do the request here instead
	of in the constructor
	componentDidMount() {

	}
	*/

	//The reason we use get derived state from props
	//to set the state when we recieve the accessKey
	//and secretKey prop changes instead of just
	//a controlled component or uncontrolled component
	//with key is because the state which holds rekognition
	//is derived from the props (the access and secret key)
	//not just a copy of the props themselves, or modification
	//of the copy, but a new object entirely that is derived
	//from the prop, so this is the rare case you use it.
	//If I decided to house rekognition one level up (App),
	//then I could just pass rekognition down as a controlled
	//component
	static getDerivedStateFromProps(props, state) {
		if (props.accessKey !== state.accessKey || props.secretKey !== state.secretKey) {
			console.log("getting derived state");
			if (props.accessKey && props.secretKey) {
				let rekognition = setRekogObj(props.accessKey, props.secretKey);
				return {
					rekognition: rekognition
				};
			}
		}
		return null;
	}

	static setRekogObj(accessKey, secretKey) {
		console.log("SETTING REKOG");
		var cleanAccessKey = encodeURI(escape(accessKey));
		var cleanSecretKey = encodeURI(escape(secretKey));
		var rekognition = new AWS.Rekognition({endpoint: 'rekognition.us-east-2.amazonaws.com', region: 'us-east-2', accessKeyId: cleanAccessKey, secretAccessKey: cleanSecretKey});
		return rekognition;
	}

	render() {
		return (
			<main className="container">
				<Switch>
					<Route exact path='/' component={HomePage}/>
					<Route path='/login' render={(routeProps) => <LogInIAM {...routeProps} handleSubmit={this.props.handleSignInSubmit} rekognition={this.state.rekognition} />} />
					<Route exact path='/manage-collections' render={(routeProps) => <ManageCollections {...routeProps} rekognition={this.state.rekognition} />} />
					<Route path='/manage-collections/:name' render={(routeProps) => <ManageCollection {...routeProps} rekognition={this.state.rekognition} />} />
				</Switch>
	  		</main>
		);
	}
}

export default MainContent;