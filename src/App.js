import React, {Component}from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

// Clarifai api key 
const app = new Clarifai.App({
 apiKey: 'b49d8766d11d4623b4b03f409594f015'
})
// react-particles-js package for background animation effect
const paricleoptions= {
    particles: {
      line_linked: {
        shadow: {
          enable: true,
          color: "#3CA9D1",
          blur: 5
        }
      }
    }
  }

class App extends Component {
  constructor(){
    super();
    this.state= {
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:false
    }
  }

  //  fetching data from facerecognition-api using fetch-api
  // componentDidMount(){
  //   fetch('http://localhost:5000')
  //   .then(response => response.json())
  //   .then(console.log);
  // }
  // storing bounding box values obtained from face_detection api call
  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  // set values for box object
  displayFaceBox = (box) => {
    // console.log(box);
    this.setState({box: box});
  }
//  Enter image url to detect
  onInputChange = (event) =>{
   this.setState({input:event.target.value});
  }
// On clicking detect button to detect faces in pictures by passing image url as input 
// this sets imageUrl with a input url for detecting face
  onButtonSubmit = () =>{
   this.setState({imageUrl:this.state.input});
     
    // here we specify what model to we are using i.e FACE_DETECT or COLOR_MODEL
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,this.state.input)
         .then(response =>this.displayFaceBox( this.calculateFaceLocation(response)))
         .catch(err => console.log(err))
  }

  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState({isSignedIn:false})
    }
    else if(route === 'home'){
        this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }
  
  render(){
    const {imageUrl,isSignedIn,box,route} = this.state;
    return (
      <div className="App">
        <Particles className='particles' 
        params={paricleoptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route === 'home'
         ?  <div>
         <Logo />
         <Rank/>
         <ImageLinkForm 
         onInputChange={this.onInputChange} 
         onButtonSubmit={this.onButtonSubmit}
         />
         <FaceRecognition box={box} imageUrl={imageUrl}/>
         </div>
         :
         (
           route === 'signin' ? 
           <Signin onRouteChange ={this.onRouteChange}/> :
           <Register onRouteChange ={this.onRouteChange}/>
         )    
      }
      </div>
    );
  }
  
}
 
export default App;
