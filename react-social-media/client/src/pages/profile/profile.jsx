import '../../components/feed/feed'
import '../../components/left-sidebar/left-sidebar'
import Leftsidebar from '../../components/left-sidebar/left-sidebar'
import '../../components/rightbar/rightbar'
import Rightbar from '../../components/rightbar/rightbar'
import Topbar from '../../components/topbar/topbar'
import './profile.css'
import ProfileHeader from '../../components/profileheader/profileheader'
import { useParams } from 'react-router-dom'
import {useContext, useState, useRef } from 'react'
import Feed from '../../components/feed/feed'
import { Context } from '../../contextapi/Context'
import Hamburger from '../../components/hamburgermenu/hamburger'

export default  function Profile(){
  
  //grabs the current logged in user fron context api
  const {currentUser, fetchUser} = useContext(Context)

    //userid of person's profile you are viewing
    const userId = useParams();


    const [reRender, setreRender] = useState(1);
   
    //this function is used to rerender the component when a post has been created (in share component and post component for example)
    //this function changes the value in rerender state. this is a dependancy for useEffect hook, which will trigger the component to rerender.
    //this is used to selectively rerender particular components, more selective than window.location.reload()
    const reset = () => {
         setreRender(Math.random());
     }

    return(
        <>
            <Hamburger profile={userId}/>
            <Topbar  home={true} profile={true} />
            <div className="profile-container">
                <div className="content">
                    <div className='leftbar'>
                        <Leftsidebar profile={userId} />
                    </div>
                    <div className='profileright'>
                        <div className="profile-top">
                            <ProfileHeader id={userId.id}/>
                        </div>
                        <div className="profile-bottom">
                            <Feed userId={userId.id}/>
                        </div>
                    </div> 
                </div>
            </div>
    </>
    )
}