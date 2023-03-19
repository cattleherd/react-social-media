import "./login.css";
import { useContext, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../contextapi/Context";
import Button from "react-bootstrap/Button";
import $ from "jquery";

export default function Login() {
  const navigate = useNavigate();

  const { fetchUser } = useContext(Context);

  const username = useRef();
  const password = useRef();

  //login method which sends user credentials to login route
  const LoginUser = async function (userCredentials) {
    try {
      await axios({
        method: "POST",
        data: userCredentials,
        withCredentials: true,
        url: "/users/api/login",
        headers: {
          "Access-Control-Allow-Origin": "https://rad-social.herokuapp.com/",
        },
        //if response is successful, updates user stored in context, and fetches the user from context
      }).then((res) => {
        $(".lock-top, .lock-body, .lock-spinner").removeClass("loading");
        $(".lock-top, .lock-body, .lock-spinner").addClass("loaded");
        fetchUser();
        setTimeout(function() {
            navigate("/");
          }, 1000);
      });
    } catch (err) {
        $(".lock-top, .lock-body, .lock-spinner").removeClass("loading");
      console.log(err);
    }
  };

  //submit the login request on button click
  const handleSubmit = (e) => {
    $(".lock-top, .lock-body, .lock-spinner").addClass("loading"); //trigger lock animation
    e.preventDefault();
    let userCredentials = {
      username: username.current.value,
      password: password.current.value,
    };
    LoginUser(userCredentials);
  };

  // make your ajax call here instead of the timeout
  /*setTimeout(function(){
        $('.lock-top, .lock-body, .lock-spinner').toggleClass('loading').then(()=>{
            console.log('lol')
        });
        $('.lock-top').toggleClass('loaded').then(()=>{
            console.log('lol')
        });
      }, 1000)
      */

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <h3 className="slogan">Radsocial</h3>
          <div className="circle"></div>
          <p style={{color: 'aquamarine', fontSize:'medium'}}>Because your privacy matters</p>
        </div>
        <div className="login-form">
          <div className="login-form-wrapper">
            <div className="lockwrapper">
              <svg className="lockimg">
                <path
                  y="50"
                  className="lock-top"
                  d="M64,50V18.7C64,12,58.9,6.6,52.6,6.6h-3.5c-6.3,0-11.3,5.4-11.3,12.1v25.9"
                />
                <circle className="lock-outline" cx="50.9" cy="65.4" r="27" />
                <path
                  className="lock-body"
                  d="M50.9,41.4c-13.2,0-24,10.7-24,24c0,13.2,10.7,24,24,24c13.2,0,24-10.7,24-24C74.9,52.2,64.1,41.4,50.9,41.4z M56.2,61.9
            c-1.1,1.5-1.3,3-1.3,4.8c0.1,3,0.1,6.1,0,9.1c-0.1,2.8-1.6,4.4-4,4.5c-2.5,0.1-4.3-1.6-4.5-4.4c-0.1-1.9,0-3.9,0-5.8c0,0,0,0,0,0
            c0-1.4,0.1-2.8,0-4.2c-0.2-1.3-0.5-2.7-1.2-3.8c-1.5-2.7-1.1-6.3,1.1-8.3c2.4-2.2,6-2.3,8.6-0.2C57.3,55.5,58,59.2,56.2,61.9z"
                />
                <path
                  className="lock-spinner"
                  d="M73.3,65.7c0,12.2-9.9,22.1-22.1,22.1"
                >
                  <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="rotate"
                    from="0 50.9 65.4"
                    to="360 50.9 65.4"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
            <input
              type="username"
              className="form-item email"
              ref={username}
              placeholder="enter your username"
            />
            <input
              type="password"
              className="form-item password"
              ref={password}
              placeholder="enter your password"
            />
            <Button className="loginbutton" onClick={handleSubmit}>
              Login
            </Button>
            <Button className="registerbuttonss" href="/register">
              Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
