import React, {Component}from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
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
      box:{}
    }
  }
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
  
  render(){
    return (
      <div className="App">
        <Particles className='particles' 
        params={paricleoptions}
        />
        <Navigation />
        <Logo />
        <Rank/>
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
  
}
 
export default App;
