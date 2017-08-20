var EventEmitter = require("events").EventEmitter;
var https = require("https");
var http = require("http");
var util = require("util");

function Artist(artist) {

    EventEmitter.call(this);

    artistEmitter = this;

    //Connect to the API URL (http://api.musicgraph.com/api/v2/artist/search?api_key=${api.key}&name=${artist})
    var request = http.get("http://api.musicgraph.com/api/v2/artist/search?api_key=c8303e90962e3a5ebd5a1f260a69b138&name=" + artist, function(response) {
        var body = "";

        if (response.statusCode !== 200) {
            request.abort();
            //Status Code Error
            artistEmitter.emit("error", new Error("There was an error getting the details for " + artist + "." + http.STATUS_CODES[response.statusCode]));
        }

        //Read the data
        response.on('data', function (chunk) {
            body += chunk;
            response.write(body);
            artistEmitter.emit("data", chunk);
        });

        response.on('end', function () {
            if(response.statusCode === 200) {
                try {
                    //Parse the data
                    var artistResult = JSON.parse(body);
                    artistEmitter.emit("end", artistResult);
                } catch (error) {
                    artistEmitter.emit("error", error);
                }
            }
        });
        
        response.on("error", function(error){
            artistEmitter.emit("error", error);
        });
    });
    request.on('error', function(error){
        artistEmitter.emit("error", error);
    });
}

util.inherits( Artist, EventEmitter );

module.exports = Artist;