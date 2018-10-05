import React from 'react';
import { Carousel } from 'react-bootstrap';

const HomePage = () => (
  <div>
    <Carousel>
	  <Carousel.Item>
	    <img width={900} height={500} alt="900x500" src="https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/BBmc1w7Iiq35z51n/videoblocks-4k-animation-3d-abstract-dark-background-moving-graph-bar-infographic-dot-a_ssydjrccw_thumbnail-small01.jpg" />
	    <Carousel.Caption>
	      <h3>First slide label</h3>
	      <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
	    </Carousel.Caption>
	  </Carousel.Item>
	  <Carousel.Item>
	    <img width={900} height={500} alt="900x500" src="https://images.all-free-download.com/images/graphiclarge/business_infographic_design_with_diagram_on_dark_background_6825426.jpg" />
	    <Carousel.Caption>
	      <h3>Second slide label</h3>
	      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
	    </Carousel.Caption>
	  </Carousel.Item>
	  <Carousel.Item>
	    <img width={900} height={500} alt="900x500" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScuY1w5XWbNPXV7G8_6FUTElc-vP1gUXCmp7m-kQf7KkaVSUMC7w" />
	    <Carousel.Caption>
	      <h3>Third slide label</h3>
	      <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
	    </Carousel.Caption>
	  </Carousel.Item>
	</Carousel>
  </div>
);

export default HomePage;