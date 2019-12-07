"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const serveur = express();

const apiCle = '44aacdb5c3e417260c94faca83d8cac0'; 

serveur.use(
  bodyParser.urlencoded({
    extended: true
  })
);

serveur.use(bodyParser.json());

serveur.post("/meteo", function(req, res) {

	let ville = req.body.queryResult.parameters.city;
	let url = 'http://api.openweathermap.org/data/2.5/weather?q='+ville+'&units=metric&appid='+apiCle+'&lang=fr';
	request.get(url,(err,res,body)=>{
		if(!err && res.statusCode == 200){
			let json = JSON.parse(body);
			console.log(json);
			let temp = ~~(json.main.temp);
			let msg = 'Le temps à '+json.name+' est '+json.weather[0].description+' et la température est de '+temp+'°C'
			return res.json({
			    //payload: speechResponse,
			    //data: speechResponse,
			    fulfillmentText: msg,
			    displayText: msg,
			    source: "meteo"
			});
		}else{
			let erreurMsg = 'Je ne trouve pas cette ville';
			return res.json({
			    //payload: speechResponse,
			    //data: speechResponse,
			    fulfillmentText: erreurMsg,
			    displayText: erreurMsg,
			    source: "meteo"
			});
		}
  
  
});


serveur.listen(process.env.PORT || 8080, function() {
  console.log("Le serveur est lancé ...");
});
