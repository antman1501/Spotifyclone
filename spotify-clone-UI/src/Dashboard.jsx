import React, { useEffect, useState } from 'react'
import useAuth from './useAuth'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player'
import axios from 'axios'

const client_ID = import.meta.env.VITE_CLIENT_ID;

const spotifyApi=new SpotifyWebApi({
  clientId: client_ID,
  //redirectUri:'http://localhost:5173',
})

const Dashboard = (props) => {
  
  const accessToken = useAuth(props.code)
  const [search,setSearch]=useState("")
  const [searchResults,setSearchResults]=useState([])
  const [playingTrack,setPlayingTrack]=useState()
  const [lyrics, setLyrics]=useState('')
  //console.log(searchResults)

  function chooseTrack(track){
    setPlayingTrack(track)
    setSearch('')
    setLyrics('')
  }

  useEffect(()=>{
    if(!playingTrack)return

    axios.get('http://localhost:2000/lyrics',{
      params:{
        track:playingTrack.title,
        artist:playingTrack.artist
      }
    }).then(res=>{
      //console.log(res)
      setLyrics(res.data.lyrics)
    })
  },[playingTrack])

  useEffect(()=>{
    if(!accessToken)return
    spotifyApi.setAccessToken(accessToken)
  },[accessToken])

  useEffect(()=>{
    if(!search) return setSearchResults([])
    if(!accessToken)return
    
    let cancel=false

    spotifyApi.searchTracks(search).then(res=>{
      setSearchResults(res.body.tracks.items.map(track =>{
        if(cancel)return;
        //console.log(track.album.images[0])
        const smallestAlbumImage = track.album.images.
          reduce((smallest,image)=>{
            if(image.height<smallest.height)return image
            return smallest
          },track.album.images[0])

        return {
          artist : track.artists[0].name,
          title : track.name,
          uri : track.uri,
          albumUrl : smallestAlbumImage.url,
          backgroundImageAlbumUrl:track.album.images[0]
        }
      }))
    })

    return ()=> cancel=true
  },[search,accessToken])

  //console.log(lyrics);
  return (
    <Container className='d-flex flex-column py-2' style={{height:'100vh',width:"100%", backgroundColor:'black',color:'rgb(223,221,221)'}}>
      <Form.Control
       type='search'
       placeholder='Search Songs/Artists'
       value={search}
       onChange={e=>setSearch(e.target.value)} style={{width:"20rem"}}/>
      <div className='flex-grow-1 my-2' style={{overflowY:'auto'}}>
        {searchResults.map((track,index)=>(
          <TrackSearchResult
           track={track}
           key={index}
           chooseTrack={chooseTrack}/>
        ))}
        {/* {searchResults.length===0&&(
          <div className='text-center' style={{whiteSpace:'pre'}}>
           
          </div>
        )} */}
        {searchResults.length===0&&typeof(playingTrack)!="undefined"&&(
          <img src={playingTrack?.backgroundImageAlbumUrl.url} style={{width:"100%",height:"29rem",border:"none"}}/>
        )}
      </div>
      <div>
        {playingTrack&&<Player accessToken={accessToken} trackUri={playingTrack?.uri} track={playingTrack} setPlayingTrack={setPlayingTrack}/>}
        
      </div>
    </Container>
  )
}

export default Dashboard