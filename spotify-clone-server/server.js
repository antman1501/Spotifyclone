const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const spotifyWebApi = require('spotify-web-api-node')
const lyricsFinder=require('lyrics-finder')
require('dotenv').config();

const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

redirect_Uri=process.env.VITE_REDIRECT_URI;
client_Id=process.env.VITE_CLIENT_ID;
client_Secret=process.env.VITE_CLIENT_SECRET;

app.post('/refresh',(req,res)=>{
    
    const refreshToken= req.body.refreshToken
    //console.log("hil")
    const spotifyApi=new spotifyWebApi({
        redirectUri:redirect_Uri,
        clientId:client_Id,
        clientSecret:client_Secret,
    })
    spotifyApi.setRefreshToken(refreshToken);
    //console.log(spotifyApi.refreshToken)
    spotifyApi.refreshAccessToken().then(
  (data) => {
    res.json({
        accessToken:data.body.access_token,
        expiresIn:data.body.expires_in
    })
    //console.log(data.body.access_token)
    spotifyApi.setAccessToken(data.body['access_token']);
  }).catch((err)=>{
    console.log(err)
    res.sendStatus(400)
  })
})

app.post('/login',(req,res)=>{
    const code=req.body.code
    //console.log('hi')
    const spotifyApi=new spotifyWebApi({
        redirectUri:redirect_Uri,
        clientId:client_Id,
        clientSecret:client_Secret
    })
    spotifyApi.authorizationCodeGrant(code).then(data=>{
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch((err)=>{
        res.sendStatus(400)
    })
})

app.get('/lyrics',async(req,res)=>{
    //console.log(req.query.track)
    const lyrics=(await lyricsFinder(req.query.artist,req.query.track))
    //console.log(typeof(lyrics))
    res.json({lyrics})
    //console.log(lyrics)
})

app.listen(2000)