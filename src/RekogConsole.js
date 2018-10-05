import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import { setRekogObj } from './App.js';

class RekogConsole extends Component {
	constructor(props) {
		super(props);
	    this.state = { rekognition: this.props.location.rekognition };
	    //if prop didn't get passed
	    //(page refresh, hard-code entered URL, etc.)
	    //set it from place we get it anyways, sessionStorage
	    /*
	    if (!this.props.location.rekognition) {
	      this.state = {
	      	rekognition: setRekogObj(sessionStorage.getItem("accesskey"), sessionStorage.getItem("secretkey"))
	      };
	    }
	    */
	}

	render() {
		//console.log(this.props);
		//<Route path={`${this.props.match.path}/ListCollections`} component={ListCollections} />
		return (
			<div>
				{ this.state.rekognition ?
					<div>
						<h3>You are logged in to your AWS IAM account</h3>
						<div>
							<Link to={{ pathname: `${this.props.match.path}/ManageCollections`, rekognition: this.state.rekognition}}><button>Manage Collections</button></Link>
							<button>Compare Face(s) to Collection</button>
						</div>
					</div>
					:
					<div>
						<h3>You are not logged into an AWS IAM account</h3>
						<Link to="/login"><button>Log In</button></Link>
					</div>
				}

			</div>
		);
	}
}

export default RekogConsole;