import React, { createContext, useReducer, useEffect, useState} from 'react'
import axios from 'axios'


export const Context = createContext('default') //creates context object with default value
                                     


//provider provides a wrapper so you can wrap components so they have access to context
//it passes the context reducer, so actions using dispatch can update the useReducer state
export const Provider = ({children})=>{
    const [currentUser, setCurrentUser] = useState('')

    //this function is called if we want to see if a user is still logged in
    //passed to child components to see if user is still stored in req.user from passport
    const fetchUser = async function(){
        try{
            await axios({
                method: 'GET',
                url: '/users/api/info',
            }).then(res=>{
                setCurrentUser(res.data)
            })
        }catch(err){
            console.log('user is not logged in')
        }
        
    }

    //provide fetchUser and currentUser to all children
    return (
        <Context.Provider value={{ fetchUser, currentUser }}>
            {children}
        </Context.Provider>
    )


}