import React from "react";
import "./hamburger.css";
import { Person, Search, Chat } from "@material-ui/icons";
import Friendslist from "../friendslist/friendslist";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../contextapi/Context";
import axios from "axios";
import { elastic as Menu } from "react-burger-menu";
import Button from "react-bootstrap/esm/Button";

export default function Hamburger({ profile }) {
  const { currentUser } = useContext(Context);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  //follow and unfollow requests
  const follow = async function () {
    await axios.put(`/users/api/${profile.id}/follow`).then((res) => {
      window.location.reload();
    }); //rerender entire page when request completes
  };
  const unfollow = async function () {
    await axios.put(`/users/api/${profile.id}/unfollow`).then((res) => {
      window.location.reload();
    });
  };

  //search profile of a person
  const handleSearch = async function () {
    await axios.get(`/users/api/username/${search}`).then((res) => {
      if (res.data.username) {
        navigate(`/profile/${res.data._id}`);
        window.location.reload();
      } else {
        alert("user not found");
      }
    });
  };

  return (
    <>
      <Menu right>
        <div className="hamburger-container">
          <div className="item search">
            <div
              className="search-button"
              style={{ cursor: "pointer" }}
              onClick={handleSearch}
            >
              <Search className="search-icon" />
            </div>
            <input
              type="text"
              value={search}
              style={{ border: "1px solid #dcdcdc", padding: "5px" }}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="search..."
              className="search-input"
            />
          </div>
          <div className="links">
            {/*follow/unfollow buttons */}
            {/* nested ternary, first checks to see if you are viewing your profile, since you cant follow yourself, it will render no button */}
            {/*first checks if logged in user is not the same as the profile your viewing (cant follow yourself)*/}
            {currentUser && profile && currentUser._id !== profile.id ? (
              /* then checks if the user is followed or not, conditionally rendering follow or unfollow button  */
              !currentUser.followingCount.includes(profile.id) ? (
                <Button
                  style={{ width: "100%", marginTop: "30px", backgroundColor: 'aquamarine', color:'#004233'}}
                  className="followbutton"
                  variant="primary"
                  onClick={follow}
                >
                  follow
                </Button>
              ) : (
                <Button
                  style={{ width: "100%", marginTop: "30px", backgroundColor: 'aquamarine', color:'#004233' }}
                  className="followbutton"
                  onClick={unfollow}
                >
                  unfollow
                </Button>
              )
            ) : (
              ""
            )}
          </div>
          <Friendslist />
        </div>
      </Menu>
    </>
  );
}
