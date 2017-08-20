var fs = require('fs');

function mergeValues(values, content){
    //Cycle over the key of the values
    //Replace all {{key}} with the value from the values object
    for(var key in values){
        content = content.replace("{{" + key + "}}", values[key]);
    }

    return content;

}

function view (templateName, values, response) {
    //Read from template file 
    var fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: "utf8"});
    //Insert values into content
    fileContents = mergeValues(values, fileContents);
    //Write content to response
    response.write(fileContents);
}

module.exports.view = view;