import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CollectionItem from './CollectionItem.js';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import './ManageCollections.css';
//import { setRekogObj } from './LogInIAM.js';

class ManageCollections extends Component {

  constructor(props) {
    super(props);

    if (localStorage.getItem("collectionlist")) {
      this.state = {
        collectionList: localStorage.getItem("collectionlist")
      }
    } else {
      this.state = {
        collectionList: []
      }
    }
  }

  componentDidMount() {
    if (!localStorage.getItem("collectionlist")) {
      var params = {
      };
      //if rekognition is set as a prop as it should be if logged in
      if (this.props.rekognition) {
        //listCollections does NOT count towards images processed
        this.props.rekognition.listCollections(params, (err, data) => {
          if (err) console.log(err, err.stack); // an error occurred
          else {
            var collList = data.CollectionIds.map((name) => {
              return {
                name: name,
                faces: '?',
                manage: <Link to={`/manage-collections/${name}`}><Button>Manage {name}</Button></Link>
              };
            });
            this.setState({
              collectionList: collList
            });
            //console.log(data);
            //console.log(collList);
          }
        });
      } else {
        console.log("rekognition is not set");
      }
    }
  }

  /*

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
      CollectionId: this.state.newCollectionName
    };
    //createCollection does NOT count towards images processed
    this.state.rekognition.createCollection(params, (err, data) => {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        console.log(data);
        this.setState({
          newCollectionResponse: data
        });
      }
    });
    
    console.log(this.state.newCollectionName)
  }
  */

  render() {
    console.log(this);
    /*
    //if the list exists (takes time to populate, might
    //not at first so do this check, or might fail)
    //for each in collection list, make item component and add it
    var collectionItems;
    if (this.state.collectionList) {
      collectionItems = this.state.collectionList.CollectionIds.map((item) => {
        //get total number of images
        //CAN ALSO DO rekognition.describeCollection()
        //such a bug it's defined in docs but not
        //in actual implementation
        var numImgs = -1;
        var params = {
          //CollectionId: item
        };
        //listFaces DOES count toward 1 image processed
        console.log(this.state.rekognition);
        this.state.rekognition.listCollections(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else {
            numImgs = 21;
            console.log(data);
          }
        });
        console.log(item);
        return (
          <CollectionItem key={item} itemName={item} numFaces={numImgs} rekognition={this.state.rekognition} path={this.props.match.path} />
        );     
      })
    }
    
    //console.log(this.state.collectionList)
    //var collectionItems;
    */
    /*
    return (
      <div>
        <Link to={{ pathname: '/console', rekognition: this.state.rekognition}}><button>Back To Console</button></Link>
        <h2>Manage Collections</h2>
        { collectionItems }
        <h4>Create New Collection</h4>
        <form onSubmit={this.handleSubmit}>
          Collection Name: <input type="text" name="newCollectionName" value={this.state.newCollectionName} onChange={this.handleChange} /><br />
          <input type="submit" value="Submit" />
        </form>
        { this.state.newCollectionResponse &&
          <p>a response</p>
        }

      </div>
    );
    */
    const columns = [{
      dataField: 'name',
      text: 'Collection Name'
    }, {
      dataField: 'faces',
      text: '# Of Faces'
    }, {
      dataField: 'manage',
      text: 'Manage Collection'
    }];
    return (
      <div>
        <h2>Collection List</h2>
        <BootstrapTable keyField="name" data={this.state.collectionList} columns={columns} bordered={false} noDataIndication="Table is Empty" />
      </div>
    );
  }

}

export default ManageCollections;
