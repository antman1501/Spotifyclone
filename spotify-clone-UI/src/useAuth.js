import axios from 'axios'
import React, { useEffect, useState } from 'react'

const useAuth = (code) => {
  const [accessToken,setAccessToken] = useState()
  
  const [refreshToken,setRefreshToken] = useState()

  const [expiresIn,setExpiresIn] = useState()

  useEffect(()=>{
    //console.log(code)
    if(code){
      axios.post('http://localhost:2000/login',{
        code,
    })
    .then(res=>{
      //console.log(res)
      setAccessToken(res.data.accessToken)
      setRefreshToken(res.data.refreshToken)
      setExpiresIn(res.data.expiresIn)
      //console.log(res)
      window.history.pushState({},null,'/')
    })
    .catch((err)=>{
      //console.log(err)
      window.location='/'
    })
    }
    
  },[code])

  useEffect(()=>{
    if(refreshToken&&expiresIn){
      const interval = setInterval(()=>{
        axios.post('http://localhost:2000/refresh',{
        refreshToken,
    })
    .then(res=>{
      setAccessToken(res.data.accessToken)
      // setRefreshToken(res.refreshToken)
      setExpiresIn(res.data.expiresIn)
      //console.log(res.data.accessToken)
      window.history.pushState({},null,'/')
    })
    .catch(()=>{
        window.location='/'
    })
      },(expiresIn-60)*1000)
      return () => clearInterval(interval)
    }
    
  },[refreshToken,expiresIn])

  return accessToken
}

export default useAuth