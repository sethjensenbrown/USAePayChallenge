const API_URL = 'https://cors-anywhere.herokuapp.com/https://sandbox.usaepay.com/api/v2/transactions';
const API_KEY = '_AlK02587rBXT03ygn890rqDl3xOwc8g';
const SEED = 'abcdefghijklmnop';
//hashed using an online generator
const API_PREHASH = 'c887d48e02b0e75de7fd95fe29bdb3bddaf982105db3d9bdf0c942002cb77c9e';
const API_HASH = 's2/' + SEED + '/' + API_PREHASH;
const AUTH_KEY = window.btoa(API_KEY + ":" + API_HASH);

//Event Listener for "buy" button under short board
$('#buy-short').on('click', event => {
	event.preventDefault();
	//hide select-board section and reveal buy-board section
	$('#select-board').addClass('hide');
	$('#buy-board').removeClass('hide');
	//load short board element into board-container without "buy" button
	let selectedBoard = $('#board-short').html();
	$('#board-container').html(selectedBoard);
	$('#board-container > button').remove();
});

//Event Listener for "buy" button under fun board
$('#buy-fun').on('click', event => {
	event.preventDefault();
	//hide select-board section and reveal buy-board section
	$('#select-board').addClass('hide');
	$('#buy-board').removeClass('hide');
	//load fun board element into board-container without "buy" button
	let selectedBoard = $('#board-fun').html();
	$('#board-container').html(selectedBoard);
	$('#board-container > button').remove();
});

//Event Listener for "buy" button under long board
$('#buy-long').on('click', event => {
	event.preventDefault();
	//hide select-board section and reveal buy-board section
	$('#select-board').addClass('hide');
	$('#buy-board').removeClass('hide');
	//load long board element into board-container without "buy" button
	let selectedBoard = $('#board-long').html();
	$('#board-container').html(selectedBoard);
	$('#board-container > button').remove();
});

//event listener for "purchase" button in buy-board section
$('#purchase-board').on('submit', event => {
	event.preventDefault();
	//get values from form and puts into object
	let values = {};
	$('#purchase-board').serializeArray().forEach(pair => {
		values[pair.name] = pair.value;
	});
	//get price of board
	let price = $('#board-container > p > strong > span.price').text();
	//configure authorization header
	let authorization = "Basic " + AUTH_KEY;
	//setup request and AJAX settings
	let settings = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": authorization
		},
		dataType: "json",
		data: JSON.stringify({
		    "command": "cc:sale",
		    "amount": price,
		    "creditcard": values
		}),
		error: (err, message) => {
			$('body').removeClass('loading');
			alert("There was a server error while processing your transaction, please try again or contact the system administrator. Error Message: " + message);
			console.log(err);
		},
		success: res => {
			$('body').removeClass('loading');
			if (res.result != "Approved") {
				alert(`The purchase was not approved because: "${res.error}". Please check your information and try again.`);
				console.log(res);
			}
			else {
				$('#buy-board').addClass('hide');
				$('#sold-board').removeClass('hide');
			}
		}
	};
	//make AJAX request
	$('body').addClass('loading');
	$.ajax(API_URL, settings);
});

//event listener for "buy another board" button on board-sold section
$('#refresh-button').on('click', event => {
	event.preventDefault();
	window.location.reload();
});




