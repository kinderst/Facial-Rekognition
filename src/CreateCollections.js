import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { setRekogObj } from './LogInIAM.js';

class CreateCollections extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      rekognition: this.props.location.rekognition,
      collectionName: '',
      response: null
    };
    //if for some reason the prop didn't get passed
    //(page refresh, hard-code entered URL, etc.)
    //check the place we get it anyways, sessionStorage
    if (!this.props.location.rekognition) {
      this.state = {
        rekognition: setRekogObj(sessionStorage.getItem("accesskey"), sessionStorage.getItem("secretkey")),
        collectionName: '',
        response: null
      };
    }
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleSubmit = event => {
    //prevent page refresh
    event.preventDefault();
    
    //create collection
    var params = {
      CollectionId: this.state.collectionName
    };
    this.state.rekognition.createCollection(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        console.log(data);
        this.setState({
          response: data
        });
      }
    });
  }

  render() {
    return (
      <div>
        <Link to={{ pathname: '/console', rekognition: this.state.rekognition}}><button>Back To Console</button></Link>
        <h2>Create Collection</h2>
        <form onSubmit={this.handleSubmit}>
          Collection Name: <input type="text" name="collectionName" value={this.state.collectionName} onChange={this.handleChange} /><br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }

}

export default CreateCollections;
