import React, { useState } from "react";
import './App.css'
import Signin from './Signin'
import Code from './Code'
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
const [code, setCode] = useState("");


  return (
    <>
    <Router>
  <div className="App">
    <div className="content">
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Signin data={[username,password,code]} methods={[setUsername,setPassword,setCode]}  />} />
        <Route path="/otp" element={ <Code data={[username,password,code]} methods={[setCode]} />} />

      </Routes>
    </div>
  </div>
</Router>

    </>
  )
}

export default App
