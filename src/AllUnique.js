import React from 'react';
import FileBase64 from 'react-file-base64';
import ImageGrid from './ImageGrid';

class AllUnique extends React.Component {
	constructor(){
		super();
		this.state = {
			files: [],
			isComparing: false,
			uniqueResults: []
		};
		this.handleClick = this.handleClick.bind(this);		
		this.getFiles = this.getFiles.bind(this);
	}

	getFiles(files){
		this.setState({ files: files })
		//console.log(this.state);
	}

	handleClick() {
		if (!this.state.isComparing) {
			if (this.state.files.length === 0) {
				//alert("No files");
			} else if (this.state.files.length === 1) {
				//alert("Only One File");
			} else {
				//alert("Beginning comparing Faces");
				this.gatherResults();
			}
		}	else {
			//alert("Is already comparing");
		}	
	}

	gatherResults() {
		this.setState({ isComparing: true });
		console.log("Gathering");

		var canvas=document.getElementById("allfacescanvas");
		var ctx=canvas.getContext("2d");
		var faceImgs = document.getElementsByClassName("alluniqueimg");
		ctx.drawImage(faceImgs[0], 0, 0, );
		/*
		var imageObj1 = new Image();
		var imageObj2 = new Image();
		imageObj1.src = "1.png"
		imageObj1.onload = function() {
			ctx.drawImage(imageObj1, 0, 0, 328, 526);
			imageObj2.src = "2.png";
			imageObj2.onload = function() {
				ctx.drawImage(imageObj2, 15, 85, 300, 300);
				var img = c.toDataURL("image/png");
				document.write('<img src="' + img + '" width="328" height="526"/>');
			}
		};
		*/
		this.setState({ isComparing: false });
	}

	//<UniqueResults results={this.state.uniqueResults} />
	render() {
	    return (
			<div className="allunique">
				<FileBase64 multiple={true} onDone={this.getFiles} />
				<ImageGrid images={this.state.files} />
				<button onClick={this.handleClick}>Compare Faces</button>
				
			</div>
	    );
	}
}

export default AllUnique;