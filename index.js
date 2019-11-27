const express = require("express");
var unirest = require("unirest");

var port = process.env.PORT || 8080;

const server = express();

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