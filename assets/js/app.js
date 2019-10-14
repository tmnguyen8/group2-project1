// GLOBAL VARIABLES
// **************************************************
var departureCity = "";
var arrivalCity = "";
var departureDate = ""; //date in yyyy-mm-dd format;
var arrivalDate = "2019-12-12"; ////NEED TO BE MODIFIED
var currency = "USD";
var carrier = [];
var quoteList = [];
var responseFlight = {};
var carrierIdObj = {};
var responseActivities = {};
var responseRestaurants = {};
var activityList = [];
var restaurantList = [];
var favList = [];

// FUNCTIONS
// **************************************************

// Calendar
var dateFormat = $("#datepicker").datepicker( "option", "dateFormat" );
 

$( function() {
	$( "#datepicker" ).datepicker({
		dateFormat: "yy-mm-dd"
	  });
		$( "#datepicker" ).datepicker();
		$( "#anim" ).on( "change", function() {
		  $( "#datepicker" ).datepicker( "option", "showAnim", $( this ).val() );
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

// function to call skyscanner
function callSkyscannerAPI() {
	var requestFlight = {
		"async": true,
		"crossDomain": true,
		"url": `https://cors-anywhere.herokuapp.com/https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${departureCity}-sky/${arrivalCity}-sky/${arrivalDate}?`,
		// "url": `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${departureCity}/${arrivalCity}/${departureDate}/${arrivalDate}?`,
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
			"x-rapidapi-key": "7f95cad964msh067a2a02b0ea134p1cb269jsn874a5ce1bf6c"
		}
	};

	$.ajax(requestFlight).then(function (responseFlight) {
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
	$(".flight-results").empty();
	if (quoteList.length === 0) {
		$(".flight-results").append(`
			<h4 class="no-result-text"><i class="fas fa-heart-broken"></i> Sorry no result found for this flight search <i class="fas fa-heart-broken"></i></h4>
		`);
	} else {
		for (i of quoteList) {
			var carrierId = i.OutboundLeg.CarrierIds[0];
			var carrier = carrierIdObj[carrierId];
			var directStatus = "";
			if (i.Direct === true) {
				directStatus = "nonstop";
			} else {
				directStatus = "layover";
			};
			$(".flight-results").append(`
				<div class="flight-quote row">
					<div class="flight-info col s12">
						<div class="row">
							<p class="airline col s4" data-airlineId="${i.OutboundLeg.CarrierIds[0]}">${carrier}</p>
							<p class="col s4 flight-city">${departureCity} to ${arrivalCity}</p>
							<p class="col s4 flight-status">${directStatus}</p>
						</div>
					</div>
					<h5 class="min-price col s2">$${i.MinPrice}</h5>
				</div>
			`);
		};
	}
	
};

// GET Yelp API
var token = 'Bearer jFVJNfB3Noyg_PpbzsCaewJ62IvGkS-twRfhB13JwiqNJU8XSmm-F9q2oPC9QgyRwODUZG_PeyftYHo0au77YUG61QxCS48CV4UeVOcRLyuehkrVFGl9m_Jhf2iXXXYx';
var corURL = 'https://cors-anywhere.herokuapp.com';
var yelpSearchURL = 'https://api.yelp.com/v3/businesses/search';
var businessID = "";

// function to call Yelp Activities
function callYelpAct() {
	var requestObjAct = {
		url: corURL + '/' + yelpSearchURL,
		data: {term: "top 5 activities", location: arrivalCity},
		headers: {'Authorization': token},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('AJAX error, jqXHR = ', jqXHR, ', textStatus = ',
			textStatus, ', errorThrown = ', errorThrown)
		}
	};

	$.ajax(requestObjAct).done(function(response) {
		responseActivities = response;
		activityList = responseActivities.businesses;
		// businessID = response.businesses[0].id;
		displayActivities();
	});	
}

// function to call Yelp Restaurants
function callYelpRest() {
	var requestObjRest = {
		url: corURL + '/' + yelpSearchURL,
		data: {term: "restaurants", location: arrivalCity},
		headers: {'Authorization': token},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('AJAX error, jqXHR = ', jqXHR, ', textStatus = ',
			textStatus, ', errorThrown = ', errorThrown)
		}
	};

	$.ajax(requestObjRest).done(function(response) {
		responseRestaurants = response;
		restaurantList = responseRestaurants.businesses;
		// businessID = response.businesses[0].id;
		displayRestaurants();
	});	
}
// Display Top Activities
function displayActivities(){
	$(".activity-results").empty();
	// console.log(activityList);
	for (i of activityList.slice(0,5)) {
		var id = i.id;
		var name = i.name;
		var review = i.rating;
		var url = i.url;
		var imgURL = i.image_url;
		var address = `${i.location.address1} ${i.location.city} ${i.location.zip_code}`
		$(".activity-results").append(`
			<a href="${url}" class="activity row">
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

// Display Top Restaurants
function displayRestaurants(){
	$(".restaurant-results").empty();
	// console.log(restaurantList);
	for (i of restaurantList.slice(0,5)) {
		var id = i.id;
		var name = i.name;
		var review = i.rating;
		var url = i.url;
		var imgURL = i.image_url;
		var address = `${i.location.address1} ${i.location.city} ${i.location.zip_code}`
		$(".restaurant-results").append(`
			<a href="${url}" class="restaurant row">
				<div class="restuarant-info col s12">
					<div class="row">
						<p class="name col s4" data-restId="${id}">${name}</p>
						<p class="col s4">Rating: ${review}</p>
						<p class="col s4">${address}</p>
					</div>
				</div>
				<img src="${imgURL}" class="rest-img" style="width: 100px; height:100px">
			</a>
		`);
	};
};

// display favorites
function displayFavList() {
	$(".favorite-results").empty();
	var localStorageFav = JSON.parse(localStorage.getItem("favorites"));
	favList = localStorageFav;
	$(".flight-container").hide();
	$(".activity-container").hide();
	$(".restaurant-container").hide();

	for (i of favList) {
		console.log(i);
		$(".favorite-results").append(`
			<ul class="collection">
				<li class="collection-item">		
					<span class="fav-flight-span">${i.departureCity} to ${i.arrivalCity}</span>
					<p class="fav-departure-text">Departure Date: ${i.departureDate}</p>
					<button class="btn" id="fav-item-btn" data-departureCity="${i.departureCity}" data-arrivalCity="${i.arrivalCity}" data-departureDate="${i.departureDate}">
						<i class="fav-heart fas fa-heart"></i>
					</button>
				</li>
			</ul>
		`);
	};
};

// EXECUTIONS
// **************************************************
// start the page with no display flight, activity, restaurants
$(".flight-container").hide();
$(".activity-container").hide();
$(".restaurant-container").hide();
$(".favorite-container").hide();

$(document).on("click", ".search-btn", function(event) {
	event.preventDefault();
	// hide favorite
	$(".favorite-container").hide();
	$(".flight-container").show();
	$(".activity-container").show();
	$(".restaurant-container").show();
	departureCity = $("input.input-departure").val().trim().slice(0,3);
	arrivalCity = $("input.input-arrival").val().trim().slice(0,3);
	departureDate = $(".input-date").val();
	console.log(`depart=${departureCity} | arrive=${arrivalCity} | date=${departureDate}`)
	callSkyscannerAPI();
	callYelpAct();
	callYelpRest();
});

$(document).on("click", ".add-fav-btn", function(event) {
	event.preventDefault();
	if ((departureCity !== "") && (arrivalCity !== "") && (departureDate !== "")) {
		favList.push({
			departureCity: departureCity,
			arrivalCity: arrivalCity,
			departureDate: departureDate
		});
		localStorage.setItem("favorites", JSON.stringify(favList));
	}	
});

$(document).on("click", ".display-fav-btn", function(event) {
	event.preventDefault();
	$(".flight-container").hide();
	$(".activity-container").hide();
	$(".restaurant-container").hide();
	$(".favorite-container").show();
	displayFavList();
});

$(document).on("click", "#fav-item-btn", function(event) {
	event.preventDefault();
	// show flight, activity and restaurant container; hide favorite container
	$(".flight-container").show();
	$(".activity-container").show();
	$(".restaurant-container").show();
	$(".favorite-container").hide();
	departureCity = $(this).attr("data-departureCity");
	arrivalCity = $(this).attr("data-arrivalCity");
	departureDate = $(this).attr("data-departureDate");
	console.log(departureCity, arrivalCity, departureDate)
	callSkyscannerAPI();
	callYelpAct();
	callYelpRest();
});


