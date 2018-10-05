import React, { Component } from 'react';

class ImageDisplay extends Component {
	constructor(props){
		super(props);
	}

	render() {
		console.log(this.props);
		return (
			<div className="imagedisplay">
				{this.props.images[0] && (
					<img src={this.props.images[0].base64} />
				)}
				{this.props.images[1] && (
					<img src={this.props.images[1].base64} />
				)}
				{this.props.images.length > 1 && this.props.compareFaceData &&
					<div>
						{this.props.compareFaceData.FaceMatches.length > 0 && 
							<p>Theres a match!</p>
						}
						{this.props.compareFaceData.FaceMatches.length <= 0 && 
							<p>No matches</p>
						}
					</div>
				}
			</div>
		);
	}
}

export default ImageDisplay;