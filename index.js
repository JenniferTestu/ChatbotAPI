"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');

const server = express();

const apiCle = '44aacdb5c3e417260c94faca83d8cac0'; 

var port = process.env.PORT || 8080;
var result;

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

// Meteo
server.post('/webhook', function (req, res) {

	if(!req.query)return res.sendStatus(400)
	res.setHeader('Content-Type','application/json');
	var city = req.query['geo-city'];
	var w = getWeather(city);
	let response = " ";
	let responseObj={
           "fulfillmentText":response
          ,"fulfillmentMessages":[
              {
                  "text": {
                      "text": [w]
                  }
              }
          ]
          ,"source":""
    }
    return res.json(responseObj);
});

function cb (err,response,body){
	if(err){
		console.log('error: ',error);
	}
	var weather = JSON.parse(body)
	if(weather.message==='Je ne trouve pas cette ville'){
		result='Impossible de trouver la météo '+weather.message;
	}else{
		result='Le temps à '+weather.name+' est '+weather.weather[0].description+' et la température est de '+weather.main.temp+'°C';
	}
}

function getWeather(city){
	result=undefined;
	var url = 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&units=metric&appid='+apiCle+'&lang=fr';
	var req = request(url,cb);
	while(result===undefined){
		require('deasync').runLoopOnce();
	}
	return result;
}

server.listen(port, function () {
  console.log("Le serveur est lancé ...");
});