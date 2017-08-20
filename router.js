var Artist = require("./artist.js");
var renderer = require("./renderer.js");
var queryString = require('querystring');
var commonHeaders = {"Content-Type": "text/html"};

//Handle HTTP route GET / and POST / 
function home(request, response){
  //if url == "/" && GET
  // show search
  if(request.url === "/"){
    if(request.method.toLowerCase() === "get"){

      response.writeHead(200, commonHeaders);
      renderer.view("header", {}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response); 

      response.end();
    } else {
      //if url == "/" && POST
      //get the post data from body

      request.on('data', function(postBody){
        //extract the artist 
        var query = queryString.parse(postBody.toString());
        //redirect to /:artist
        response.writeHead(303, {"Location": "/" + query.artist});
        response.end();
      });
    }
  }
}

//Handle HTTP route GET /:artist ie /PearlJam
function artist(request, response){
  var artist = request.url.replace("/", "");
  if(artist.length > 0){

    response.writeHead(200, commonHeaders);
    renderer.view("header", {}, response);

    //get JSON from API
    var artistResult = new Artist(artist);

    //on end show artist
    artistResult.on('end', function (artistJSON) {
        //show artist

        //Store the values which we need
        var values = {
          avatarUrl : artistJSON.data[0].musicbrainz_image_url,
          artistName : artistJSON.data[0].name,
          genre : artistJSON.data[0].main_genre,
          country : artistJSON.data[0].country_of_origin
        };
        // Simple response
        renderer.view("artist", values, response);
        renderer.view("footer", {}, response);
        response.end();

    });
    // get JSON error
    artistResult.on('error', function (e) {
         //show error
        renderer.view("error", {errorMessage: 'e.message'} , response);
        renderer.view("search", {}, response);
        renderer.view("footer", {}, response);
        response.end();
    });    
  }
}

module.exports.home = home;
module.exports.artist = artist;