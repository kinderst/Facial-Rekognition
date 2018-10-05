import React from 'react';

const ImageGrid = (props) => {
  //console.log(props);

  var imageItems = props.images.map(function(img){
    //console.log(img);
    return (
      <div className="col-4" key={img.base64.substr(img.base64.length - 64)}>
        <img src={img.base64} alt={img.name} className="alluniqueimg" />
      </div>
    );     
  })
  return (
    <div className="imagegrid">
      <div className="row">
        <canvas id="allfacescanvas"></canvas>
      </div>
      <div className="row">
        {imageItems}
      </div>
    </div>
  )
}

export default ImageGrid;
