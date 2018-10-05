/*
Notes:

Need to make external image id be changable by user
so they can specify multiple images of one person

Need to consider if collection data should be passed as
a prop or not, leaning towards yes. Can only get here
from manage collections, so should have it passed from
there, but it is not a child like MainContent child
of App, and ManageCollection(s) child of MainContent,
it is a link. Maybe thats what ...routeProps is for?
because I know I can pass it through with the expanded
<Link to={}>, but then on refresh it won't be there
ANSWERED: Move Rekognition to MainContent along with
getting the collection data in MainContent and passing
it as props to both ManageCollection(s)
Reasoning: child needs a prop, just keep it one parent
above the top most children that need it, ie MainContent,
since ManageCollection(s) are children that both need,
keep it one parent above
*/

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './ManageCollection.css';
import { Grid, Row, Col, Image, Button, ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import CollectionItem from './CollectionItem.js';
import { setRekogObj } from './App.js';
import FileBase64 from 'react-file-base64';
import Dropzone from 'react-dropzone';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';


class ManageCollection extends Component {

  constructor(props) {
    super(props);
    //If we have collection data, we set it
    if (localStorage.getItem("collectiondata")) {
      console.log(JSON.parse(localStorage.getItem("collectiondata")));
      const currCollectionData = JSON.parse(localStorage.getItem("collectiondata"));
      console.log(currCollectionData[this.props.match.params.name]);
      this.state = { 
        collectionName: this.props.match.params.name,
        collectionData: currCollectionData[this.props.match.params.name],
        compareData: [], //array of data objects for table
        queueFiles: [],
        addTrueCompareFalse: true
      };
    } else {
      this.state = { 
        collectionName: this.props.match.params.name,
        collectionData: {
          Faces: [],
          FaceModelVersion: 0.0
        },
        compareData: [],
        queueFiles: [],
        addTrueCompareFalse: true
      };
    }
  }

  onDrop = files => {
    //credit filebase64 author
    var allFiles = [];
    for (var i = 0; i < files.length; i++) {
      let file = files[i];
      console.log(file);
      // Make new FileReader
      let reader = new FileReader();
      // Convert the file to base64 text
      reader.readAsDataURL(file);
      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        let fileInfo = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000) + ' kB',
          base64: reader.result,
          file: file,
          externalImageId: file.name + '' + file.lastModified
        };
        // Push it to the array
        allFiles.push(fileInfo);
        // If all files have been proceed
        if(allFiles.length == files.length){
          //Set State
          this.setState({
            queueFiles: allFiles
          });
        }
      }
    }
  }

  handleButtonChange = event => {
    this.setState({
      addTrueCompareFalse: event
    });
  }

  //get the base64 encoding of a file
  //(necessary for AWS to get base64 image bits)
  getBase64 = file => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      //console.log(reader.result);
      return reader.result
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  //translates base64 encoded file into binary
  //(necessary for AWS to accept image bits)
  getBinary = encodedFile => {
    var base64Image = encodedFile.split("data:image/jpeg;base64,")[1];
    console.log(base64Image);
    var binaryImg = atob(base64Image);
    var length = binaryImg.length;
    var ab = new ArrayBuffer(length);
    var ua = new Uint8Array(ab);
    for (var i = 0; i < length; i++) {
      ua[i] = binaryImg.charCodeAt(i);
    }

    var blob = new Blob([ab], {
      type: "image/jpeg"
    });

    return ab;
  }

  deleteCollection = () => {
    var params = {
      CollectionId: this.state.collectionName
    };
    this.state.rekognition.deleteCollection(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        console.log(data);
        alert("Collection Deleted");
      }
    });
  }

  //deletes a face from the current collection
  //given a face id
  deleteFaceFromCollection = faceId => {
    console.log(faceId);
    
    var params = {
      CollectionId: this.state.collectionName, 
      FaceIds: [faceId]
    };
    //deleteFaces does NOT towards images processed
    this.props.rekognition.deleteFaces(params, (err, data) => {
      if (err) console.log(err, err.stack); // an error occurred
      else { // successful response
        //console.log(data);
        //create new copy of array of faces with deleted face filtered out
        let copyCollectionDataFaces = this.state.collectionData.Faces.filter((obj) => {
          return obj.FaceId !== data.DeletedFaces[0]
        });
        //create copy of collection data and set the updated faces array
        let copyCollectionData = this.state.collectionData;
        copyCollectionData.Faces = copyCollectionDataFaces;
        //update local and state storage
        this.setCollectionDataStorage(copyCollectionData)
      }           
    });
    
  }

  //adds all the faces in state.queueFiles
  //to the collection
  addFacesToCollection = () => {
    console.log("Adding Faces To Collection");
    console.log(this.state.queueFiles);
    if (this.state.queueFiles.length > 0) {
      for (let i = 0; i < this.state.queueFiles.length; i++) {
        var sourceImgBytes = this.getBinary(this.state.queueFiles[i].base64);
        var externalImageId = this.state.queueFiles[i].externalImageId
        var params = {
          CollectionId: this.state.collectionName, 
          DetectionAttributes: [], 
          ExternalImageId: externalImageId, 
          Image: {
            Bytes: sourceImgBytes
          }
        };
        //indexFaces COUNTS towards 1 image process
        this.props.rekognition.indexFaces(params, (err, data) => {
          if (err) console.log(err, err.stack); // an error occurred
          else { // successful response
            console.log(data);
            
            //get copy of collection data
            let copyCollectionData = this.state.collectionData;
            //for each face added
            for (let i = 0; i < data.FaceRecords.length; i++) {
              //push face object into collection copy Faces
              copyCollectionData.Faces.push(data.FaceRecords[i].Face)
            }
            
            //set updated collection data in storage (and state)
            this.setCollectionDataStorage(copyCollectionData);
            
          }                
        });
      }
    } else {
      console.log("No images in queue");
    }
  }

  clearCompareData = () => {
    this.setState({
      compareData: []
    });
  }

  compareFacesToCollection = () => {
    console.log("Attempting to compare faces");
    if (this.state.queueFiles.length > 0) {
      for (let i = 0; i < this.state.queueFiles.length; i++) {
        var sourceImgBytes = this.getBinary(this.state.queueFiles[i].base64);
        var params = {
          CollectionId: this.state.collectionName, 
          FaceMatchThreshold: 80, 
          Image: {
            Bytes: sourceImgBytes
          },
          MaxFaces: 5
        };
        this.props.rekognition.searchFacesByImage(params, (err, data) => {
          if (err) console.log(err, err.stack); // an error occurred
          else { // successful response
            console.log(data);
            //get copy of state compare data face matches array
            let currCompareData = this.state.compareData;
            //create object for data table
            const matches = data.FaceMatches;
            const compareResult = {
              fileId: this.state.queueFiles[i].externalImageId,
              matchOne: matches.length > 0 ? "" + matches[0].Similarity + "%, " + matches[0].Face.ExternalImageId : "none",
              matchTwo: matches.length > 1 ? "" + matches[1].Similarity + "%, " + matches[1].Face.ExternalImageId : "none",
              matchThree: matches.length > 2 ? "" + matches[2].Similarity + "%, " + matches[2].Face.ExternalImageId : "none",
              matchFour: matches.length > 3 ? "" + matches[3].Similarity + "%, " + matches[3].Face.ExternalImageId : "none",
              matchFive: matches.length > 4 ? "" + matches[4].Similarity + "%, " + matches[4].Face.ExternalImageId : "none",
            };
            //update copy data with new data
            currCompareData.push(compareResult);
            console.log(currCompareData);
            //set state
            
            this.setState({
              compareData: currCompareData
            });
            
          }
        });
      }
    } else {
      console.log("No faces in queue");
    }
  }

  refreshFacesForStorage = () => {
    console.log(localStorage.getItem("collectiondata"));
    //set MaxResults to as high as necessary
    //since it doesn't cost more
    var params = {
      CollectionId: this.state.collectionName, 
      MaxResults: 20
    };
    this.props.rekognition.listFaces(params, (err, data) => {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        console.log(data);
        /*
        //set new collection data var
        let allCollectionData = {};
        //check if there is current/old collection data in local storage
        if (localStorage.getItem("collectiondata")) {
          //if so, so the var to the current data
          allCollectionData = JSON.parse(localStorage.getItem("collectiondata"));
        }
        //add the new data to the var for this collection
        allCollectionData[this.state.collectionName] = data;
        //set it in local storage
        localStorage.setItem("collectiondata", JSON.stringify(allCollectionData))
        //and in state at same time
        this.setState({
          collectionData: allCollectionData[this.state.collectionName]
        });
        */

        this.setCollectionDataStorage(data);
      }
    });
  }

  //Sets the local storage for the collection data
  //(and updates state to reflect the data)
  setCollectionDataStorage = data => {
    //set new collection data var
    let allCollectionData = {};
    //check if there is current/old collection data in local storage
    if (localStorage.getItem("collectiondata")) {
      //if so, so the var to the current data
      allCollectionData = JSON.parse(localStorage.getItem("collectiondata"));
    }
    //add the new data to the var for this collection
    allCollectionData[this.state.collectionName] = data;
    //set it in local storage
    localStorage.setItem("collectiondata", JSON.stringify(allCollectionData))
    //and in state at same time
    this.setState({
      collectionData: allCollectionData[this.state.collectionName]
    });
  }

  render() {
    /*
    if (this.state.collectionData && this.state.collectionData[this.state.collectionName]) {
      externalIdList = this.state.collectionData[this.state.collectionName].Faces.map((faceData) => {
        return (
          <div key={faceData.ExternalImageId}>
            {faceData.ExternalImageId}
            <button onClick={() => {this.deleteFaceFromCollection(faceData.FaceId)}}>Delete</button>
          </div>
        );     
      })
    }
    { externalIdList ?
          { externalIdList }
          :
          <div>
            <h5>Could not find collection data</h5>
            <button onClick={this.getCollectionData}>Get Collection Data (1*)</button>
          </div>
        }  
    
    var externalIdList;
    console.log(this);
    console.log(JSON.parse(localStorage.getItem("collectiondata")));
    if (this.state.collectionData && this.state.collectionData[this.state.collectionName]) {
      externalIdList = this.state.collectionData[this.state.collectionName].Faces.map((faceData) => {
        return (
          <div key={faceData.ExternalImageId}>
            {faceData.ExternalImageId}
            <button onClick={() => {this.deleteFaceFromCollection(faceData.FaceId)}}>Delete</button>
          </div>
        );     
      });
    }
    
    //Should add place where user can manually enter image id?
    return (
      <div>
        <Link to={{ pathname: '/console', rekognition: this.state.rekognition}}><button>Back To Console</button></Link>
        <h2>Manage Collection!!!</h2>
        <h3>{this.state.collectionName}</h3>
        <div>
          <button onClick={this.deleteCollection}>Delete Collection</button>
        </div>
        <div>
          <button onClick={this.addFacesToCollection}>Add Face(s) To Collection {this.state.uploadImageFiles.length}*</button>
          <FileBase64 multiple={ true } onDone={ this.getNewFiles } />
          { addFaceImages }
        </div>
        <div>
          <button onClick={this.compareFacesToCollection}>Cmpare Face(s) Cllction {this.state.compareImageFiles.length}*</button>
          <FileBase64 multiple={ true } onDone={ this.getCompareFiles } />
        </div>
        <h4>List of existing image/face id's:</h4>
        { externalIdList ?
          externalIdList
          :
          <div>
            <h5>Could not find collection data</h5>
            <button onClick={this.getCollectionData}>Get Collection Data (1*)</button>
          </div>
        }
      </div>
    );
    */
    //var imagesForUpload;
    //if (this.state.queueFiles.length > 0) {
      var imagesForUpload = this.state.queueFiles.map((imageFile, index) => {
        console.log(this.state.queueFiles[index].externalImageId);
        return {
          original: imageFile.base64,
          thumbnail: imageFile.base64,
          description: "id: " + imageFile.externalImageId,
          originalClass: "gallery-image-orig",
          thumbnailClass: "gallery-image-thumb"
        };
        /*
        return (
          <div key={imageFile.name}>
            <Image src={imageFile.base64} alt="image to be uploaded" rounded responsive />
          </div>
        );    
        */ 
      });
    //}

    //Set columns for compare data faces
    //checking if rendering condition is true
    if (this.state.compareData.length > 0) {
      //set columns function scope
      var compareDataColumns = [{
        dataField: 'fileId',
        text: 'File ID'
      }, {
        dataField: 'matchOne',
        text: '1st Match'
      }, {
        dataField: 'matchTwo',
        text: '2nd Match'
      }, {
        dataField: 'matchThree',
        text: '3rd Match'
      }, {
        dataField: 'matchFour',
        text: '4th Match'
      }, {
        dataField: 'matchFive',
        text: '5th Match'
      }];

      //set export CSV button function scope
      var MyCompareExportCSV = (props) => {
        const handleClick = () => {
          props.onExport();
        };
        return (
          <div>
            <Button onClick={ handleClick }>Export to CSV</Button>
            <Button onClick={this.clearCompareData}>Clear Results</Button>
          </div>
        );
      };
    }

    //When stringifying/parsing json, the JSX elements
    //get lost, so can't put buttons in the data set
    //(was weird anyways)
    //add delete buttons to the data(...? lol) for the table
    const collectionDataButtons = this.state.collectionData.Faces.map((faceData) => {
      return {
        FaceId: faceData.FaceId,
        Confidence: faceData.Confidence,
        ExternalImageId: faceData.ExternalImageId,
        ImageId: faceData.ImageId,
        Delete: <Button onClick={() => {this.deleteFaceFromCollection(faceData.FaceId)}}>Delete</Button>
      };
    });
    //Set columns for existing faces
    const currentFaceColumns = [{
      dataField: 'FaceId',
      text: 'Face ID'
    }, {
      dataField: 'Confidence',
      text: 'Confidence'
    }, {
      dataField: 'ImageId',
      text: 'Image ID'
    }, {
      dataField: 'ExternalImageId',
      text: 'External Image ID'
    }, {
      dataField: 'Delete',
      text: 'Delete Face'
    }];

    const MyFacesExportCSV = (props) => {
      const handleClick = () => {
        props.onExport();
      };
      return (
        <div>
          <Button onClick={ handleClick }>Export to CSV</Button>
          <Button onClick={this.refreshFacesForStorage}>Refresh Face Data (1*)</Button>
        </div>
      );
    };
    console.log(this);
    return (
      <div>
        <h2>Manage {this.state.collectionName}</h2>
        <ButtonToolbar>
          <ToggleButtonGroup type="radio" name="options" value={this.state.addTrueCompareFalse} onChange={this.handleButtonChange} justified>
            <ToggleButton value={true}>Add Face(s)</ToggleButton>
            <ToggleButton value={false}>Compare Face(s)</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <Grid>
          <Row>
            <Col xs={4} md={4} lg={4}>
              <Dropzone className="dropzone" onDrop={this.onDrop}>
                <h4>Drag & Drop Images Here</h4>
                <h5>Or click to browse from explorer</h5>
              </Dropzone>
            </Col>
            <Col xs={6} md={6} lg={6}>
              {imagesForUpload.length > 0 &&
                <ImageGallery items={imagesForUpload} showFullscreenButton={false} showPlayButton={false} />
              }
            </Col>
            <Col xs={2} md={2} lg={2}>
              <div>
                {this.state.addTrueCompareFalse ?
                  <Button onClick={this.addFacesToCollection}>Add Face{this.state.queueFiles.length > 1 &&
                    "s"
                  }
                  </Button>
                :
                  <Button onClick={this.compareFacesToCollection}>Compare Faces</Button>
                }
              </div>
            </Col>
          </Row>
        </Grid>
        {this.state.compareData.length > 0 &&
          <div>
            <h3>Compare Face Results</h3>
            <ToolkitProvider keyField="fileId" data={this.state.compareData} columns={compareDataColumns} exportCSV>
              {
                props => (
                  <div>
                    <BootstrapTable { ...props.baseProps } bordered={false} noDataIndication="Table is Empty" />
                    <hr />
                    <MyCompareExportCSV { ...props.csvProps } />
                  </div>
                )
              }
            </ToolkitProvider>
          </div>
        }
        <h3>Existing Faces</h3>
        <ToolkitProvider keyField="FaceId" data={collectionDataButtons} columns={currentFaceColumns} exportCSV>
          {
            props => (
              <div>
                <BootstrapTable { ...props.baseProps } bordered={false} noDataIndication="Table is Empty" />
                <hr />
                <MyFacesExportCSV { ...props.csvProps } />
              </div>
            )
          }
        </ToolkitProvider>
      </div>
    );
  }

}

export default ManageCollection;