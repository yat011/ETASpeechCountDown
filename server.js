const express = require('express');
const bodyParser = require('body-parser')
var request = require('request-promise');
const path = require('path');
const app = express();
const textToSpeech = require('@google-cloud/text-to-speech');
const tmp = require('tmp');
// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();

async function generateSpeech(text, filepath) {
  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'yue-HK', "name":"yue-HK-Standard-B"},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(filepath, response.audioContent, 'binary');
  // console.log('Audio content written to file: output.mp3');
}

 


app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());


app.get('/ping', function (req, res) {
 return res.send({"msg":"OKAY"});
});

app.post('/speech', async function (req, res) {
  console.log(req.body);

  const text = req.body['text']
  tmp.file(postfix='.mp3', async function _tempFileCreated(err, path, fd, cleanupCallback) {
    if (err) throw err;

    console.log('File: ', path);
    console.log('Filedescriptor: ', fd);
    await generateSpeech(text, path);

    await res.sendFile(path);
    // If we don't need the file anymore we could manually call the cleanupCallback
    // But that is not necessary if we didn't pass the keep option because the library
    // will clean after itself.
    // cleanupCallback();
  });
  
 });


app.post('/busETA', async function (req, res) {
  console.log(req.body);
  let baseURL = "https://rt.data.gov.hk/";

  let routes = req.body['routes'];
  let stop_id = req.body['stop']
  var results = []

  for (const routeId of routes){
    var apiUrl = baseURL+"/v1/transport/citybus-nwfb/eta/nwfb/"+stop_id+"/"+routeId;
    console.log(apiUrl);
    body = await request({uri:apiUrl, json:true});
    data = body['data'];

    console.log(data);
    results = results.concat(data);
  }
  res.send(results);
});






// generateSpeech();


console.log("Server is starting..")
app.listen(process.env.PORT || 8080);