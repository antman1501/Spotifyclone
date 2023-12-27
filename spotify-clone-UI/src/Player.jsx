import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import SpotifyWebPlayer from 'react-spotify-web-playback';


const Player = (props) => {

    const [play,setPlay]=useState(false)
    

    useEffect(()=>{
      setPlay(true);},[props.trackUri])

    function playSong (){
        axios.put("https://api.spotify.com/v1/me/player/play",{
          uris:[props.trackUri],
        },
        {
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },
      }
        )
        setPlay(true);
      }

    function pauseSong(){
        axios.put("https://api.spotify.com/v1/me/player/pause",
        {},
        {
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },}
        )
        setPlay(false);
      }

    if(!props.accessToken)return null;
  return (
    <>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    {/* {console.log(props.trackUri)} */}
  <SpotifyWebPlayer
    token={props.accessToken}
    callback={state=>{
        if(!state.isPlaying) setPlay(false)
    }}
  //persistDeviceSelection={true}
    play={play}
    uris={props.trackUri}
    styles={{bgColor:'black',color:"rgb(223,221,221)"}}/>
    {/* <Container className='d-flex flex-row justify-content-between'>
      <div>
        <p style={{fontSize:'1rem', color:'white', margin:'0', fontWeight:'bold'}}>{props.track?.title}</p>
        <p style={{fontSize:'1rem', color:'white', margin:'0', opacity:'0.7'}}>{props.track?.artist}</p>
      </div>
      <div>
      <span className="material-symbols-outlined">
skip_previous
</span>
    {play==true?<span className="material-symbols-outlined" onClick={pauseSong}>
pause
</span>: <span className="material-symbols-outlined" onClick={playSong}>
play_arrow
</span>}
      <span className="material-symbols-outlined">
skip_next
</span>
</div>
<div id='volume'>
  <span className="material-symbols-outlined dropdown">
volume_up
</span>
</div>
</Container> */}
   
    </>
  )
}

export default Player