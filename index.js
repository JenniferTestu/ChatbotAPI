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

// Meteo
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
			      //res.setHeader('Content-Type', 'application/json');
			      /*res.send({
			        fulfillmentMessages: msg,
			        fulfillmentText: msg,
			        source: 'meteo'
			      });*/
			      return res.json({
			      	"fulfillmentText": msg,
			        "fulfillmentMessages": [
			        	"simpleResponses": {
			        		"simpleResponses":[
			        		{
			        			"textToSpeech":msg,
			        			"displayText":msg
			        		}
			        		]
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

server.listen(port, function () {
  console.log("Le serveur est lancé ...");
});