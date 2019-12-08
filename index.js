"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const serveur = express();

const apiCle = '44aacdb5c3e417260c94faca83d8cac0'; 

var port = process.env.PORT || 8080;

serveur.use(bodyParser.urlencoded({extended: true}));
serveur.use(bodyParser.json());

// Test
server.get('/',function (req,res){
    res.send('Démarrage réussi !');
});

// Meteo
serveur.post("/meteo", function (req, res) {

   if (req.body.queryResult.parameters.city) {
	    let ville = req.query.city;
	    let url = 'http://api.openweathermap.org/data/2.5/weather?q='+ville+'&units=metric&appid='+apiCle+'&lang=fr';

	    if(!err && response.statusCode == 200){
		      let json = JSON.parse(body);
		      console.log(json);
		      let temp = ~~(json.main.temp);
		      let msg = 'Le temps à '+json.name+' est '+json.weather[0].description+' et la température est de '+temp+'°C';

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
		}else{
		      let erreurMsg = 'Je ne trouve pas cette ville';
		      return res.status(400).json({
		        status: {
		          code: 400,
		          errorType: erreurMsg
		        }
		      });
    	}
	}
});

server.listen(port, function () {
  console.log("Le serveur est lancé ...");
});