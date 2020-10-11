import React, {Component}from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

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


const initialState = {
  input:'',
  imageUrl:'',
  box:{},
  route:'signin',
  isSignedIn:false,
  users : {
        id: '',
        name:'',
        email:'',
        entries:0,
        joined: new Date()
  }
} 
class App extends Component {
  constructor(){
    super();
    this.state= initialState;
  }
  
  // after registration users data will added 
  loadUsers = (data) =>{
    this.setState ({users:
          {
            id: data.id,
            name: data.name,
            email:  data.email,
            entries: data.entries,
            joined:  data.joined
          }
        })
       
  }

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
// On clicking detect button to detect faces in Buttons by passing image url as input 
// this sets imageUrl with a input url for detecting face
// here we specify what model to we are using i.e FACE_DETECT or COLOR_MODEL
  onButtonSubmit = () =>{
   this.setState({imageUrl:this.state.input});
          fetch('http://localhost:5000/imageurl', {
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
              input: this.state.input
             })
          })
            .then(response => response.json())
         .then(response =>{
           if(response){
            fetch('http://localhost:5000/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.users.id
              })
            })
              .then(response => console.log(response.json()))
              .then(count => {
                this.setState(Object.assign(this.state.users, { entries:count}))
              }) 
              .catch(console.log);    
           } 
           this.displayFaceBox( this.calculateFaceLocation(response))
        })
         .catch(err => console.log(err))
  }

  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState(initialState);
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
         <Rank 
         name ={this.state.users.name} 
         entries ={this.state.users.entries}/>
         <ImageLinkForm 
         onInputChange={this.onInputChange} 
         onButtonSubmit={this.onButtonSubmit}
         />
         <FaceRecognition box={box} imageUrl={imageUrl}/>
         </div>
         :
         (
           route === 'signin' ? 
           <Signin loadUsers= {this.loadUsers} onRouteChange ={this.onRouteChange}/> :
           <Register loadUsers ={this.loadUsers} onRouteChange ={this.onRouteChange}/>
         )    
      }
      </div>
    );
  }
  
}
 
export default App;
