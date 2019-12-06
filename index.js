const express = require("express");
const unirest = require("unirest");
const bodyParser = require('body-parser');
const request = require('request');

const apiCle = '44aacdb5c3e417260c94faca83d8cac0'; 

var port = process.env.PORT || 8080;

const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Test
server.get('/',function (req,res){
    res.send('Démarrage réussi !');
});

server.get('/getName',function (req,res){
    res.send('Bim bada boum !');
});

// Le serveur est à l'écoute
server.listen(port, function () {
    console.log("Le serveur est lancé ...");
});

// Météo
server.post('/meteo',function (req,res){

		console.log(req.body.result);


    	let ville = req.body.city;
		let url = 'http://api.openweathermap.org/data/2.5/weather?q='+ville+'&units=metric&appid='+apiCle+'&lang=fr';
			request.get(url,(err,response,body)=>{
		if(!err && response.statusCode == 200){
			let json = JSON.parse(body);
			console.log(json);
			let temp = ~~(json.main.temp);
			let msg = 'Le temps à '+json.name+' est '+json.weather[0].description+' et la température est de '+temp+'°C'
			res.send(createTextResponse(msg));
			return res.json({
				speech: msg,
				displayText: msg,
				source: 'meteo'
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
	})
});

function createTextResponse(msg){
  let response = {
    "fulfillmentText": msg,
    "fulfillmentMessages": [
      {
        "text": {
          "text": [
            msg
          ]
        }
      }
    ],
    "source": "example.com",
    "payload": {
      "google": {
        "expectUserResponse": true,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": msg
              }
            }
          ]
        }
      },
      "facebook": {
        "text": msg
      },
      "slack": {
        "text": msg
      }
    }
  }
  return response;
}