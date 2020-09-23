import React from 'react';
import Tilt from 'react-tilt';
import face from './face.jpg';
import  './logo.css';
const Logo = () =>{
    return(
        <div className='ma4 mt0'>
         <Tilt className="Tilt br2 shadow-2" options={{ max : 65 }} style={{ height: 150, width: 150 }} >
             <div className="Tilt-inner pa1">
                  <img style={{paddingTop:'1px'}} alt ='logo' src={face}/> 
            </div>
        
        </Tilt>
        </div>
    )
}

export default Logo;