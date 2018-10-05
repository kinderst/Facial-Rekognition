import React, { Component } from 'react';
import FileBase64 from 'react-file-base64';
import ImageDisplay from './ImageDisplay.js';

var AWS = require('aws-sdk/dist/aws-sdk-react-native');

class UploadImage extends Component {
	constructor(props){
		super(props);
		this.state = {
			files: [],
			compareFaceData: null
		};
		this.handleClick = this.handleClick.bind(this);
	}

	getFiles(files){
		this.setState({ files: files })
	}

	getBinary(encodedFile) {
		var base64Image = encodedFile.split("data:image/jpeg;base64,")[1];
        //console.log(base64Image);
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

	handleClick() {
		if (this.state.files.length > 1) {
			/*
			var sourceImgBytes = this.getBinary(this.state.files[0].base64);
			var targetImgBytes = this.getBinary(this.state.files[1].base64);
			if (sourceImgBytes && targetImgBytes) {
				var rekognition = new AWS.Rekognition({endpoint: 'rekognition.us-east-2.amazonaws.com', region: 'us-east-2', accessKeyId: 'AKIAIM7C6K4ANVZ5HSWA', secretAccessKey: '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'});
				var params = {
					SimilarityThreshold: 90, 
					SourceImage: {
						Bytes: sourceImgBytes
					}, 
					TargetImage: {
						Bytes: targetImgBytes
					}
				};
				//this.setState({compareFaceData: null});
				var thisObj = this;
				rekognition.compareFaces(params, function(err, data) {
				
					if (err) {
						console.log(err, err.stack); // an error occurred
					} else {
						console.log(data);
						thisObj.setState({compareFaceData: data});   
					}
				});
			}
			*/
		} else {
			console.log("no go");
		}
	}

	/*
	encodeImageFileAsURL(element) {
		var file = element.files[0];
		var reader = new FileReader();
		reader.onloadend = function() {
			console.log('RESULT', reader.result)
		}
		reader.readAsDataURL(file);
	}
	*/

	render() {
		return (
			<div className="uploadimage">
				<FileBase64 multiple={true} onDone={this.getFiles.bind(this)} />
				<ImageDisplay images={this.state.files} compareFaceData={this.state.compareFaceData} />
				<button onClick={this.handleClick}>Compare Faces</button>
			</div>
		);
	}
}

export default UploadImage;