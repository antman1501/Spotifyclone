import React from 'react'

const TrackSearchResult = (props) => {
    function handlePlay(){
        props.chooseTrack(props.track)
    }
  return (
    <div
     className='d-flex m-2 align-items-center'
     style={{cursor:'pointer'}}
     onClick={handlePlay}>
        <img src={props.track?.albumUrl} style={{height:'64px' ,width:'64px'}}/>
        <div className='m1-3'>
            <div>{props.track?.title}</div>
            <div className='text' style={{color:'#737373'}}>{props.track?.artist}</div>
        </div>
    </div>
  )
}

export default TrackSearchResult