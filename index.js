"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');

const server = express();

const apiCle = '44aacdb5c3e417260c94faca83d8cac0'; 
const apiGif = 'rKjsTiokAvSUocS7JZQyTFNAEeiux2Uo'; 

var port = process.env.PORT || 8080;
var gif = " ";

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

			      gifRandom(json.weather[0].main);

			      let msg = 'Le temps à '+json.name+' est '+json.weather[0].description+' et la température est de '+json.main.temp+'°C';
			      
			      return res.json({
			      	"fulfillmentText": msg,
			        "fulfillmentMessages": [
			        	{
					      "platform": "FACEBOOK",
					      "card": {
					        "title": "Voici la météo actuellement",
					        "subtitle": msg,
					        "imageUri": gif,
					      }
					    },
					    {
					      "platform": "SKYPE",
					      "card": {
					        "title": "Voici la météo actuellement",
					        "subtitle": msg,
					        "imageUri": gif,
					      }
					    },
					    {
					      "platform": "GOOGLE",
					      "card": {
					        "title": "Voici la météo actuellement",
					        "subtitle": msg,
					        "imageUri": gif,
					      }
					    }
			        ],
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
function gifRandom(mot){

	/*var fs = require('fs')

	request({
		url:'https://api.giphy.com/v1/gifs/random',
		qs:{
		 tag: mot,
		 rating: 'PG-13',
		 api_key: 'rKjsTiokAvSUocS7JZQyTFNAEeiux2Uo'
		}}, function(err,res,data){
		if(err){
		 return console.log('Error ' + err)
		}
		request(JSON.parse(data).data.image_original_url).pipe(fs.createWriteStream(process.argv[2]+'.gif'))
	})*/
	

	var urlGif = 'https://api.giphy.com/v1/gifs/random?api_key='+apiGif+'&tag='+mot+'&rating=PG';

			request.get(urlGif,(err,response,data)=>{
			    if(!err && response.statusCode == 200){
			      let j = JSON.parse(data);
			      console.log(j.data.image_original_url);
			      
			      gif = String(j.data.image_original_url);

			    }
			});

}

server.listen(port, function () {
  console.log("Le serveur est lancé ...");
});