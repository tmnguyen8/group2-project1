// GLOBAL VARIABLES
// **************************************************
var departureCity = "ATL";
var arrivalCity = "LAX";
var departureDate = "2019-11-01" //date in yyyy-mm-dd format;
var currency = "USD";
var cityCode;
var carrier = [];
var quotes = [];

// Skyscanner API
console.log(departureDate)

// FUNCTIONS
// **************************************************
// Date Picket Scripts


// EXECUTIONS
// **************************************************

var settings = {
	"async": true,
	"crossDomain": true,
	"url": `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/${currency}/en-US/${departureCity}-sky/${arrivalCity}-sky/${'2019-12-01'}?`,
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
		"x-rapidapi-key": "7f95cad964msh067a2a02b0ea134p1cb269jsn874a5ce1bf6c"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
	carrier = response.Carriers;
	quotes = response.Quotes;

	// testing and console
	console.log(`numCarrier=${carrier.length} | `)
});

// $.getJSON( "https://raw.githubusercontent.com/tmnguyen8/JSON-Airports/master/airports.json", function( data ) {
	
// 	cityCode = data;
// });

// YELP API
var token = 'Bearer jFVJNfB3Noyg_PpbzsCaewJ62IvGkS-twRfhB13JwiqNJU8XSmm-F9q2oPC9QgyRwODUZG_PeyftYHo0au77YUG61QxCS48CV4UeVOcRLyuehkrVFGl9m_Jhf2iXXXYx';
var corURL = 'https://cors-anywhere.herokuapp.com';
var yelpSearchURL = 'https://api.yelp.com/v3/businesses/search';
function clientCallBack () {
	console.log("made it to the client callback")
}
var requestObj = {
	url: corURL + '/' + yelpSearchURL,
	data: {term: "activities", location: "Los Angeles"},
	headers: {'Authorization': token},
	error: function (jqXHR, textStatus, errorThrown) {
		console.log('AJAX error, jqXHR = ', jqXHR, ', textStatus = ',
		textStatus, ', errorThrown = ', errorThrown)
	}
};

// example of calling businesses from Yelp
var businessID = "";
$.ajax(requestObj).done(function(response) {
	console.log(response);
	businessID = response.businesses[0].id;
});




