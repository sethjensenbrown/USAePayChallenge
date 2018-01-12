//setup dependencies
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const sha256 = require('sha256');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

//setup authorization for API request
var seed = "abcdefghijklmnop";
var apikey = "_AlK02587rBXT03ygn890rqDl3xOwc8g";
var apipin = "1234";
var prehash = apikey + seed + apipin;
var apihash = 's2/'+ seed + '/' + sha256(prehash);
var authKey = new Buffer(apikey + ":" + apihash).toString('base64')
var authorization = "Basic " + authKey;

//GET endpoint for webpage
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
});

//POST endpoint for API request
app.post('/', (req, res) => {
	//setup request for API using provided info from user
	let options = {
		url: 'https://sandbox.usaepay.com/api/v2/transactions',
		method: 'POST',
		json: true,
		headers: {
			"Authorization": authorization
		},
		body: req.body
	}
	//make request and handle response
	request(options, (err, apiRes, body) => {
		if(err) {
			console.log("error");
			console.log(err);
			res.status(500).json({message: "internal server error"});
		}
		else{
			console.log("success");
			console.log(body);
			res.status(200).json({
				result: body.result,
				error: body.error || ""
			});
		}
	});
});

//tell app to listen for requests
app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});