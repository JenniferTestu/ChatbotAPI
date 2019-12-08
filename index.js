"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');

const serveur = express();

const apiCle = '44aacdb5c3e417260c94faca83d8cac0'; 

var port = process.env.PORT || 8080;

serveur.use(bodyParser.urlencoded({extended: true}));
serveur.use(bodyParser.json());

// Test
serveur.get('/',function (req,res){
    res.send('Démarrage réussi !');
});

// Meteo
serveur.post("/meteo", function (req, res) {

   if (req.query.city) {
	    let ville = req.query.city;
	    let url = 'http://api.openweathermap.org/data/2.5/weather?q='+ville+'&units=metric&appid='+apiCle+'&lang=fr';

	    request.get(url,(err,response,body)=>{

			      let json = JSON.parse(body);
			      //console.log(json);
			      let msg = 'Le temps à '+json.name+' est '+json.weather[0].description+' et la température est de '+json.main.temp+'°C';

					  return res.json({
					    fulfillmentText: msg,
					    fulfillmentMessages: [{
					      simpleResponses: {
					        simpleResponses: [{
					          "textToSpeech": "textToSpeech",
					          "displayText": msg
					        }]
					      }
					    }],
					    source: "webhook-sample"
					  });
			
   		});
	}
});

serveur.listen(port, function () {
  console.log("Le serveur est lancé ...");
});