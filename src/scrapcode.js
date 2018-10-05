/*
//MANAGE COLLECTIONS GET ALL DATA AT ONCE
//Get list of all collections
    this.state.rekognition.listCollections(params, (err, data) => {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        console.log(data);
        //define dictionary for num images for each collection
        var numImgs = {}
        //generic for loop because it's fastest and just getting names
        for (var i = 0; i < data.CollectionIds.length; i++) {
          var collectionName = data.CollectionIds[i];
          //get total number of images
          var params = {
            CollectionId: collectionName, 
            MaxResults: 20
          };
          //Get face metadata from collection, only way
          //I know how to count total faces
          this.state.rekognition.listFaces(params, (err, facesData) => {
            if (err) console.log(err, err.stack); // an error occurred
            else {
              numImgs[collectionName] = facesData.Faces.length;
            }
          });
        }
        //Set num images dictionary
        data['numImgs'] = numImgs;
        this.setState({
          collectionList: data
        });
      }
    });


    

  /*
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("gdsfp");
    if (nextProps.accessKey !== prevState.accessKey) {
      return { accessKey: nextProps.accessKey };
    } else {
      return null;
    }
  }
  */


  /*
  render() {
    return (
      <header className="App-header container">
        <div>
          <img src={logo} className="App-logo" alt="React Logo" />
        </div>
        <h1>Facial Rekognition Services</h1>
        <nav>
          <ul>
            <li><Link to='/'>Home</Link></li>
            { this.state.isLoggedIn ?
              <li><Link to='/'><button onClick={ this.logOut }>Log Out</button></Link></li>
              :
              <li><Link to='/login'>Log In</Link></li>
            }
          </ul>
        </nav>
      </header>
    );
  }
  */
*/