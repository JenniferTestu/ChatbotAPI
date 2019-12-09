"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');

const server = express();

const apiCle = '44aacdb5c3e417260c94faca83d8cac0'; 

var port = process.env.PORT || 8080;

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

// Test
server.get('/',function (req,res){
    res.send('Démarrage réussi !');
});

// Webhook de l'agent meteo
server.post('/webhook', function (req, res) {

	var displayName = req.body.queryResult.intent.displayName;
    
    switch(displayName) {

		case 'meteo': {
			var city = req.body.queryResult.parameters.City;

			var url = 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&units=metric&appid='+apiCle+'&lang=fr';
			request.get(url,(err,response,body)=>{
			    if(!err && response.statusCode == 200){
			      let json = JSON.parse(body);
			      console.log(json);
			      let msg = 'Le temps à '+json.name+' est '+json.weather[0].description+' et la température est de '+json.main.temp+'°C';
			      
			      return res.json({
			      	"fulfillmentText": msg,
			        "fulfillmentMessages": [{
			        	
			        	"card": {
			        		"imageUri": 'https://media.giphy.com/media/RMQ7kUUhfcYj6/giphy.gif'
			        	}
			        }],
			        "source": ""
			      });


			    }else{
			      let erreurMsg = 'Je ne trouve pas cette ville';
			      return res.status(400).json({
			        "status": {
			          "code": 400,
			          "errorType": erreurMsg
			        }
			      });
			    }
	  		})
		}
		break;
	}
	
});


// GIF de test https://media.giphy.com/media/RMQ7kUUhfcYj6/giphy.gif

// Fonction pour avoir un gif aleatoire a partir d'un mot cle
function GifRandom(mot){

	var fs = require('fs')

	request({
		url:'https://api.giphy.com/v1/gifs/random',
		qs:{
		 tag: mot,
		 rating: 'PG-13',
		 api_key: '???????????'
		}}, function(err,res,data){
		if(err){
		 return console.log('Error ' + err)
		}
		request(JSON.parse(data).data.image_original_url).pipe(fs.createWriteStream(process.argv[2]+'.gif'))
	})
	

	//var urlGif = 'https://api.giphy.com/v1/gifs/random?api_key='+apiGif+'&tag='+mot;
}

server.listen(port, function () {
  console.log("Le serveur est lancé ...");
});