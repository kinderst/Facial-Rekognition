import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { setRekogObj } from './LogInIAM.js';

class ListCollections extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      rekognition: this.props.location.rekognition,
      listData: []
    };
    //if for some reason the prop didn't get passed
    //(page refresh, hard-code entered URL, etc.)
    //check the place we get it anyways, sessionStorage
    if (!this.props.location.rekognition) {
      this.state = {
        rekognition: setRekogObj(sessionStorage.getItem("accesskey"), sessionStorage.getItem("secretkey"))
      };
    }
  }

  componentDidMount() {
    var params = {
    };  
    this.state.rekognition.listCollections(params, (err, data) => {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        this.setState({
          listData: data
        });
        console.log(data);
      }
    });
  }

  render() {
    //for each in ListData, make some stuff and add it
    //console.log(this);
    //<Route path={`${this.props.match.path}/ListCollections`} component={ListCollections} />
    return (
      <div>
        <Link to={{ pathname: '/console', rekognition: this.state.rekognition}}><button>Back To Console</button></Link>
        <h2>List Collections</h2>
      </div>
    );
  }

}

export default ListCollections;
