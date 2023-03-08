import './logoutbutton.css'
import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';



export default function Logoutbutton(){

const navigate = useNavigate()

const url = `/users/api/logout`

function handleLogout(){
    axios.get(url).then(res=>{
        navigate('/login')
    })
}

return(
    <button className="logoutbutton" onClick={handleLogout}>
        Logout
    </button>
)

}