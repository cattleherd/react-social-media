import '../../components/feed/feed'
import '../../components/left-sidebar/left-sidebar'
import Leftsidebar from '../../components/left-sidebar/left-sidebar'
import '../../components/rightbar/rightbar'
import Rightbar from '../../components/rightbar/rightbar'
import './home.css'
import Topbar from '../../components/topbar/topbar'
import Timeline from '../../components/timeline/timeline'
import Hamburger from '../../components/hamburgermenu/hamburger'



export default function Home(){ //passing userId and user from app component
    return(
        <>
        <Hamburger/>
        <Topbar home={true} profile={true}/>
        <div className="home-container">
            <div className="content">
                <Leftsidebar/>
                <div style={{flexGrow:'1'}}><Timeline/></div>
            </div>
        </div>
        </>
    )
}
