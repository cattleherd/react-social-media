import Topbar from "../../components/topbar/topbar";
import Messages from "../../components/messages/messages";
import Convos from "../../components/convos/convos";
import "./messages.css";
import { useState, useRef, useEffect, useContext, React } from "react";
import { Context } from "../../contextapi/Context";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { io } from "socket.io-client";
import { elastic as Menu } from "react-burger-menu";
import Skeleton from "react-loading-skeleton";

export default function Message() {
  //grabs the current logged in user fron context api
  const { currentUser, fetchUser } = useContext(Context);

  //The friends list from logged in user
  const [friends, setFriends] = useState([]);

  //online friends
  const [onlinefriends, setOnlineFriends] = useState(null);

  //friend data that logs in
  const [loggedinuser, setLoggedInUser] = useState(null);

  //friend data that leaves socket server (disconnects from site)
  const [loggedoutuser, setLoggedOutUser] = useState(null);

  //incoming event from socket server
  const [incomingMessage, setIncomingMessage] = useState(null);

  //all of the conversations of the current user
  const [Conversations, setConversations] = useState(null);

  //the selected conversation the user has clicked to view
  const [Selected, setSelected] = useState(null);

  //all messages of a particular conversation, stored in state
  const [Message, setMessage] = useState(null);

  //store the message text from input, updated dynamically
  const [NewMessage, setNewMessage] = useState("");

  //detect when component is finished rendering
  const [loading, setLoading] = useState(true);

  const [friendDiscrepancy, setFriendDiscrepancy] = useState(false);

  //store socket url in useRef state
  const socket = useRef();

  //setting up client socket
  useEffect(() => {
    //set client socket to point to socket api, blank if its same url as backend
    socket.current = io();
    //listen to when theres incoming message, then store incoming message in state
    //this is the 'outbound' message thats being sent to client after having been routed through server, and sent to the intended recipients

    socket.current.on("incomingMessage", (data) => {
      setIncomingMessage({
        sender: data.sender,
        messagetext: data.message,
        //it only contains sender and text data, so date is appended
        createdAt: Date.now(),
      });
    });

    //whenever connecting to socket, you see which friends are already online
    socket.current.on("friendslist", (data) => {
      setOnlineFriends(data);
    });
    //whenever friend logs in, theyre added to online array
    //loggedout friend state gets reset to detect next loggedout user
    socket.current.on("loggedinUser", (data) => {
      console.log("friend logged in");
      setLoggedInUser(data);
      setLoggedOutUser(null);
      console.log("logged in");
    });

    //whenever friend disconnects, they are removed from online state
    //loggedin user gets reset to detect next logged in user
    socket.current.on("loggedOutUser", (data) => {
      setLoggedOutUser(data);
      setLoggedInUser(null);
    });
  }, []);

  //when friend logs in, theyre added to onlinefriends array
  useEffect(() => {
    if (onlinefriends === null && loggedinuser) {
      setOnlineFriends([loggedinuser]);
    }
    if (onlinefriends && loggedinuser) {
      if (!onlinefriends.includes(loggedinuser)) {
        setOnlineFriends((prev) => [...prev, loggedinuser]);
      }
    }
  }, [loggedinuser]);

  //when friend logs out, they are removed from online array
  useEffect(() => {
    if (
      loggedoutuser &&
      onlinefriends.length > 1 &&
      onlinefriends &&
      onlinefriends.includes(loggedoutuser)
    ) {
      let filtered = onlinefriends.filter((e) => e !== loggedoutuser);
      setOnlineFriends(filtered);
    }
    if (
      loggedoutuser &&
      onlinefriends &&
      onlinefriends.length === 1 &&
      onlinefriends.includes(loggedoutuser)
    ) {
      setOnlineFriends(null);
    }
  }, [loggedoutuser]);

  //store friends list in state
  //friends are distinguished if a user is following someone, and that person is also following them back.
  useEffect(() => {
    if (currentUser) {
      let friendlist = [];
      currentUser.followingCount.forEach((e) => {
        if (currentUser.followerCount.includes(e)) {
          friendlist.push(e);
        }
      });
      setFriends(friendlist);
    }
  }, [currentUser]);

  //store user thats logged in, into socketio server, to track whos online (connected)
  //it runs when friends is loaded to state
  //sends storeuser event to server, which handles storing user info, and friends info, and doing important things behind the scenes.
  useEffect(() => {
    currentUser &&
      friends &&
      socket?.current.emit("storeUser", {
        userId: currentUser._id,
        friends: friends,
      });
  }, [currentUser, friends]);

  //this hook listens to see if incomingMessage gets updated, then it updates message object
  //it runs everytime client socket receives incomingMessage event
  //then it updates the state with any new messages, making so that new messages are rendered without having to refresh page
  useEffect(() => {
    Message && setMessage((prev) => [...prev, incomingMessage]);
  }, [incomingMessage]);

  //send new message to server
  const handlesubmit = async function (e) {
    e.preventDefault();
    //send new message to socketio server
    socket.current.emit("outgoingMessage", {
      sender: currentUser?._id,
      receiver: Selected.people.find((e) => e !== currentUser._id),
      message: NewMessage,
    });
    try {
      await axios({
        method: "POST",
        //data sent as req.body
        data: {
          conversationId: Selected._id,
          messagetext: NewMessage,
          sender: currentUser._id,
        },
        headers: { "Content-Type": "application/json" },
        url: `/messages/`,
      }).then((res) => {
        setNewMessage("");
      });
    } catch (err) {
      console.log(err);
    }
  };

  //functional component to scroll to bottom of a particular container
  const AlwaysScrollToBottom = () => {
    //create reference to div elementRef, and store it in useref state
    const elementRef = useRef("");
    //useEffect selects the reference div, and scrolls into view (strategically placed in bottom of container)
    useEffect(() => elementRef.current?.scrollIntoView({ behavior: "smooth" }));
    return <div ref={elementRef} />;
  };

  //sets the view of the selected conversation, when user clicks on a profile on left
  //'Selected' state changes when the user clicks on a different conversation on the left
  //this is because each profile has onclick event, which updates 'Selected' state
  useEffect(() => {
    if (Selected) {
      //selected is null in beginning, dont need unecessary useeffect call
      try {
        //delete current displayed messages from state, then fetch messages of new convos
        setMessage(null);
        const getMessages = async function () {
          //fetch messages of the 'Selected' conversation
          await axios.get(`/messages/${Selected._id}`).then((res) => {
            setMessage(res.data);
          });
        };
        getMessages();
      } catch (err) {
        console.log(err);
      }
    }
  }, [Selected]);

  //this hook is used to get all conversations of active friends, and update conversations in backend if friends were recently added
  useEffect(() => {
    let getConversations = async function () {
      let friendslist = friends; //active friends list

      let existingconvos = []; //will store a list of userids of active friends

      currentUser &&
        (await axios.get(`/conversations/${currentUser._id}`).then((res) => {
          let convos = res.data;
          let convos2 = []; //list of convos of active friends (filtering out convos of people that are no longer friends)

          //this function creates a list of userids of active friends stored in existingconvos array
          convos.forEach((convo) => {
            for (let i = 0; i < friendslist.length; i++) {
              if (convo.people.includes(friendslist[i])) {
                existingconvos.push(friendslist[i]);
              }
            }
          });

          //this function creates a list of convos of active friends stored in convos2 array
          friendslist.forEach((friend) => {
            for (let i = 0; i < convos.length; i++) {
              if (convos[i].people.includes(friend)) {
                convos2.push(convos[i]);
              }
            }
          });

          setConversations(convos2); //set conversation state

          //--------------------------this next chunk is used to check if new friends were added---------//
          // if a friend recently added it will then create a conversation object for each new friend
          //this is done

          //differences checks to see if the length of active friends is longer than length of active convos
          let differences = friendslist.filter(
            (x) => !existingconvos.includes(x)
          );

          //if there are more active friends than convos the code below iterates over each friend and creates a conversation object
          //promise is used since we need to make multiple axios calls
          if (differences.length > 0 && currentUser) {
            function getAllResponses(differences) {
              return Promise.all(differences.map(fetchData));
            }

            async function fetchData(newFriend) {
              return axios
                .post("/conversations", {
                  senderId: currentUser._id,
                  receiverId: newFriend,
                })
                .then(function (res) {
                  return res.data;
                });
            }

            //then conversation state is updated using setFriendDiscrepancy, which is added as dependency
            getAllResponses(differences).then((res) =>
              setFriendDiscrepancy(true)
            );
          }

          //---------------------------------------------------
        }));
    };

    getConversations();
  }, [friends, friendDiscrepancy]);

  return (
    <>
      <Topbar messenger={true} />
      <Menu right>
        <div className="convoWrapper2">
          <span style={{ color: "aquamarine" }}>Friends List</span>
          <hr className="separator" />
          <div className="messengermenubottom">
            {Conversations &&
              Conversations?.map((e, i) => (
                /*stores selected conversation in state (Selected state)*/
                <div
                  onClick={() => {
                    setSelected(e);
                  }}
                  key={i}
                  className="menubottom"
                >
                  {/*render convo component for each conversation that user has with other people */}
                  <Convos
                    data={e}
                    currentUser={currentUser}
                    online={onlinefriends}
                  />
                </div>
              ))}
          </div>
        </div>
      </Menu>
      <div className="messagesContainer">
        <div className="messenger">
          <div className="convoWrapper">
            <span style={{ color: "gray" }}>Friends List</span>
            <hr className="separator" />
            {Conversations ? (
              Conversations.map((e, i) => (
                /*stores selected conversation in state (Selected state)*/
                <div
                  key={i}
                  onClick={() => {
                    setSelected(e);
                  }}
                >
                  {/*render convo component for each conversation that user has with other people */}
                  <Convos
                    data={e}
                    currentUser={currentUser}
                    online={onlinefriends}
                  />
                </div>
              ))
            ) : (
              <Skeleton count={5} />
            )}
          </div>
          <div className="messageWrapper">
            {Selected ? (
              <>
                <div className="messages">
                  {Message?.map((e, i) => (
                    //if sender of message is same as logged in user, sender prop is sent to true
                    //this will style the messages component based if sender data (owner) of message is same as currentuser
                    <Messages
                      key={i}
                      data={e}
                      sender={e.sender === currentUser._id}
                    />
                    //only data.sender and data.messagetext, and data.createdAt is used to render component
                    //to be used to store incoming message format
                  ))}
                  <AlwaysScrollToBottom />
                </div>
                <div className="messageBottom">
                  <textarea
                    className="textarea"
                    onChange={(e) => setNewMessage(e.target.value)}
                    name=""
                    id=""
                    value={NewMessage}
                    cols="30"
                    rows="5"
                    placeholder="write something..."
                  ></textarea>
                  <Button
                    className="send"
                    variant="success"
                    onClick={handlesubmit}
                    href=""
                  >
                    Send
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h1 className="selectmessage">Select a conversation to view</h1>
                <h1 className="selectmessage2" style={{color: 'aquamarine'}}>
                  Select a conversation to view in top right
                </h1>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
