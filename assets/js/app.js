// GLOBAL VARIABLES
// **************************************************
var departureCity = "ATL";
var arrivalCity = "LAX";
var departureDate = "2019-10-30" //date in yyyy-mm-dd format;
var currency = "USD";
var cityCode;
var carrier = [];
var quoteList = [];
var responseFlight = {};
var carrierIdObj = {}

// FUNCTIONS
// **************************************************
// function to get carriers as string
function getCarrierName() {

};
// function to get the carrier Ids as an object
function getCarrierIds(responseFlight) {
	for (i of responseFlight.Carriers) {
		carrierIdObj[i.CarrierId] = i.Name;
	}
	return carrierIdObj;
};
// function to display quote information
function displayQuotes () {
	for (i of quoteList) {
		var carrierId = i.OutboundLeg.CarrierIds[0];
		var carrier = carrierIdObj[carrierId];
		$(".flight-container").append(`
			<div class="flight-quote row" style="border: 1px solid red">
				<div class="flight-info col s12">
					<div class="row">
						<p class="airline col s4" data-airlineId="${i.OutboundLeg.CarrierIds[0]}">${carrier}</p>
						<p class="col s4">${departureCity} to ${arrivalCity}</p>
						<p class="col s4">Direct</p>
					</div>
				</div>
				<h5 class="col s2">$${i.MinPrice}</h5>
			</div>
		`);
	}
}
// EXECUTIONS
// **************************************************
// GET Skyscanner API
var requestFlight = {
	"async": true,
	"crossDomain": true,
	"url": `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/${currency}/en-US/${departureCity}-sky/${arrivalCity}-sky/${departureDate}?`,
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
		"x-rapidapi-key": "7f95cad964msh067a2a02b0ea134p1cb269jsn874a5ce1bf6c"
	}
};

$.ajax(requestFlight).done(function (responseFlight) {
	responseFlight = responseFlight;
	quoteList = responseFlight.Quotes;
	carrierIdObj = getCarrierIds(responseFlight);
	displayQuotes();
	// testing and console
	console.log(carrierIdObj)
	console.log(responseFlight);
	console.log(quoteList);
	
});

// GET Yelp API
var token = 'Bearer jFVJNfB3Noyg_PpbzsCaewJ62IvGkS-twRfhB13JwiqNJU8XSmm-F9q2oPC9QgyRwODUZG_PeyftYHo0au77YUG61QxCS48CV4UeVOcRLyuehkrVFGl9m_Jhf2iXXXYx';
var corURL = 'https://cors-anywhere.herokuapp.com';
var yelpSearchURL = 'https://api.yelp.com/v3/businesses/search';
function clientCallBack () {
	console.log("made it to the client callback")
}
var requestObj = {
	url: corURL + '/' + yelpSearchURL,
	data: {term: "top 5 activities", location: "Los Angeles"},
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




