import React from 'react'
import {BrowserRouter,Routes, Route } from "react-router-dom";
import Face from './Face';
import Home from './Home';
import './App.css'

const App = () => {
  return (
    <div className='app'>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Face/>}/>
            <Route path='/home' element={<Home/>}/>
        </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
