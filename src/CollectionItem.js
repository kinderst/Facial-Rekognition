import React from 'react';
import { Link } from 'react-router-dom';

const CollectionItem = (props) => {

	/*
	function deleteCollection() {
		var collectionName = props.itemName;
		console.log(collectionName);

		//delete collection
		var params = {
			CollectionId: collectionName
		};
		props.rekognition.deleteCollection(params, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else {
				console.log(data);
				alert("Collection \"" + collectionName + "\" deleted, status code: " + data.StatusCode + ".");
			}
		});
	}
	*/

	return (
		<div>
			<span>{props.itemName}, #faces's: {props.numFaces}</span>
			<Link to={props.path + '/' + props.itemName}><button>Manage Collection</button></Link>
		</div>
	);
}



export default CollectionItem;