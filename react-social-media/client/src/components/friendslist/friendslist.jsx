import './friendslist.css'

import { Context } from '../../contextapi/Context';
import { useContext } from 'react'
import Recentfriends from '../../components/recentfriends/recentfriends'


export default function Friendslist(){

    const {currentUser} = useContext(Context)
    
    return (
        <div className='friends'>
        <span className='title'>Friends List</span>
        <hr className='separator'/>
        <ul className="friendslist">
        {/*first checks user is following the person and they are following them, then renders Recentfriends component */}     
        {currentUser && currentUser.followerCount && currentUser.followerCount.map(e=>(
            currentUser.followingCount.includes(e) && <Recentfriends key={e} id={e}/>
        ))}
        </ul>
    </div>
    )
}