import "./topbar.css";
import { Person, Search, Notifications, Chat } from "@material-ui/icons";
import { Context } from "../../contextapi/Context";
import { useEffect, useContext, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logoutbutton from "../logoutButton/logoutbutton";
import axios from "axios";
import Hamburger from "../hamburgermenu/hamburger";

export default function Topbar({ home, profile, messenger }) {
  const { currentUser } = useContext(Context); //grabs the state from context
  const [search, setSearch] = useState("");

  let navigate = useNavigate();
  const user = currentUser;

  const pub = process.env.REACT_APP_PUBLIC;
  return (
    <div className="Topbar-container">
      <div className="Topbar-left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">RadSocial</span>
        </Link>
        <div className="topbar-profile">
          <a href={`/profile/${user._id}`}>
            <div className="profile-pic">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt=""
                  className="topbar-profileImg"
                />
              ) : (
                <img
                  src="/assets/profile.png"
                  alt=""
                  className="topbar-profileImg"
                />
              )}
            </div>
          </a>
        </div>
        <Link to="/messages">
          <img
            className="messengericon"
            alt="friendsicon"
            src="/assets/messenger.png"
          />
        </Link>
      </div>
      {/* either show friends list or active convos whether your on messenger page*/}
      <div className="center homeandprofile">
        {messenger ? (
          <>
            <label htmlFor="react-burger-menu-btn">
              <img
                className="friendsicon"
                alt="friendsicon"
                src="/assets/friends.png"
                style={{ cursor: "pointer" }}
              />
            </label>
          </>
        ) : (
          <>
            <label htmlFor="react-burger-menu-btn">
              <img
                className="friendsicon"
                alt="friendsicon"
                src="/assets/friends.png"
                style={{ cursor: "pointer" }}
              />
            </label>
            <Hamburger />
          </>
        )}

        <Logoutbutton />
      </div>
    </div>
  );
}
