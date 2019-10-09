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
var carrierIdObj = {};
var responseActivities = {};
var activityList = [];

// FUNCTIONS
// **************************************************

// Calendar
var dateFormat = $( "#datepicker" ).datepicker( "option", "dateFormat" );
 

$( function() {
	$( "#datepicker" ).datepicker({
		dateFormat: "yy-mm-dd"
	  });
	  
});
  

// IATA code function 

const options = {
    fuse_options : {
        shouldSort: true,
        threshold: 0.4,
        maxPatternLength: 32,
        keys: [{
            name: "IATA",
            weight: 0.6
          },
          {
            name: "name",
            weight: 0.4
          },
          {
            name: "city",
            weight: 0.2
          }
        ]
      }
  };
  
  AirportInput("input-departure", options)
  AirportInput("input-arrival", options)

// GET Skyscanner API
var requestFlight = {
	"async": true,
	"crossDomain": true,
	"url": `https://cors-anywhere.herokuapp.com/https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/${currency}/en-US/${departureCity}-sky/${arrivalCity}-sky/${departureDate}?`,
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
		"x-rapidapi-key": "7f95cad964msh067a2a02b0ea134p1cb269jsn874a5ce1bf6c"
	}
};
// function to call skyscanner
function callSkyscannerAPI() {
	$.ajax(requestFlight).done(function (responseFlight) {
		responseFlight = responseFlight;
		quoteList = responseFlight.Quotes;
		carrierIdObj = getCarrierIds(responseFlight);
		displayQuotes();
		// testing and console
		console.log(responseFlight);
	});
}
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
	};
};

// GET Yelp API
var token = 'Bearer jFVJNfB3Noyg_PpbzsCaewJ62IvGkS-twRfhB13JwiqNJU8XSmm-F9q2oPC9QgyRwODUZG_PeyftYHo0au77YUG61QxCS48CV4UeVOcRLyuehkrVFGl9m_Jhf2iXXXYx';
var corURL = 'https://cors-anywhere.herokuapp.com';
var yelpSearchURL = 'https://api.yelp.com/v3/businesses/search';
var businessID = "";
var requestObj = {
	url: corURL + '/' + yelpSearchURL,
	data: {term: "top 5 activities", location: "Los Angeles"},
	headers: {'Authorization': token},
	error: function (jqXHR, textStatus, errorThrown) {
		console.log('AJAX error, jqXHR = ', jqXHR, ', textStatus = ',
		textStatus, ', errorThrown = ', errorThrown)
	}
};
// function to call Yelp
function callYelpAPI() {
	$.ajax(requestObj).done(function(response) {
		responseActivities = response;
		activityList = responseActivities.businesses;
		// businessID = response.businesses[0].id;
		displayActivities();
	});
	
}

function displayActivities(){
	console.log(activityList);
	for (i of activityList.slice(0,5)) {
		var id = i.id;
		var name = i.name;
		var review = i.rating;
		var url = i.url;
		var imgURL = i.image_url;
		var address = `${i.location.address1} ${i.location.city} ${i.location.zip_code}`
		$(".activity-container").append(`
			<a href="${url}" class="activity row" style="border: 1px solid red">
				<div class="activity-info col s12">
					<div class="row">
						<p class="name col s4" data-activityId="${id}">${name}</p>
						<p class="col s4">Rating: ${review}</p>
						<p class="col s4">${address}</p>
					</div>
				</div>
				<img src="${imgURL}" class="activity-img" style="width: 100px; height:100px">
			</a>
		`);
	}
}

// EXECUTIONS
// **************************************************

$(document).on("click", ".search-btn", function(event) {
	event.preventDefault();
	departureCity = $(".input-departure").val().trim();
	arrivalCity = $(".input-arrival").val().trim();
	date = $(".input-date").val().trim();
	callSkyscannerAPI();
	callYelpAPI();
});



