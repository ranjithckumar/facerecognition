import React from 'react';
import './imagelinkform.css';
const ImageLinkForm = ({onInputChange, onButtonSubmit}) =>{
    return(
        <div>
           <p className='f3'>
            {'Detect faces in your picture.. Give it a try.'}
           </p>
           {/* // here adding styles using tachyons package */}
           <div className='center'>
            <div className='form center pa4 br3 shadow-5'>
            <input type='text' className='f4 pa4 w-70 center' 
            onChange={onInputChange}></input>
            <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
            onClick={onButtonSubmit}
            >Detect
            </button>
            </div>
           </div>
        </div>
    );
}

export default ImageLinkForm;

