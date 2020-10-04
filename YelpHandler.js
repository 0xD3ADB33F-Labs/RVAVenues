const venueList = ["The BroadBerry", "The National", "The Camel", "Hippodrome Theater", "The Tin Pan", "Garden Groove Brewing", "Cary St. Cafe", "GwarBar", "Wonderland", "Banditos", "Cornerstone", "Bello's Lounge", "Havana", "Poe's Pub", "VMFA", "Boathouse", "Hardywood Brewery", "Godfreys", "Babes", "Kabana"]
var yelpApiKey = "mAPx052gAYztT9R-6pG72_SDN7R82iInfK5o7Lb0xGp_lojHkWPjoW1kP3ZwO0pRTEZYjo2-yH6oRoObB4c4Zv67NHD3ywan9P5hP76TENGcxqGxWe5xUbeXsVVvX3Yx"
var yelpClientId = "CMiogmoq_vGiUQIZ4ig3sA"
var yelpURL = "https://api.yelp.com/v3/businesses/{id}?"
var YelpAccessToken = "Bearer mAPx052gAYztT9R-6pG72_SDN7R82iInfK5o7Lb0xGp_lojHkWPjoW1kP3ZwO0pRTEZYjo2-yH6oRoObB4c4Zv67NHD3ywan9P5hP76TENGcxqGxWe5xUbeXsVVvX3Yx";
var YelpHeader = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: YelpAccessToken
};

var currentIndex = 0;

function getVenueInfo(venueName) {
    var richmond = "Richmond, VA"
    var url = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${venueName}&location=${richmond}`
    $.ajax({
        url: url,
        method: "GET",
        headers: YelpHeader
    }).then(function (results) {
        var response = results.businesses[0];
        getVenues();
        // var tRow = $("<tr>");
        // var nameTd = $("<td>").text(response.id);
        // var urlTd = $("<td>").text(response.url);
        // var phoneTd = $("<td>").text(response.phone);

        // // Append the newly created table data to the table row
        // tRow.append(nameTd, urlTd, phoneTd);
        // // Append the table row to the table body
        // $("tbody").append(tRow);
        console.log(response)
        var newVenue = $("#venue-info-template").clone();
        newVenue.attr("id", "venue-info-"+response.alias);
        newVenue.find("#venueUrl").attr("href", response.url);
        newVenue.find("#venueName").text(response.name);
        newVenue.find("#venueNum").text(response.phone);
        newVenue.find("#venuePhoto").attr("src", response.image_url)
        newVenue.removeClass("hide");
        $("#content").append(newVenue);

    });
}

function getVenues(){
    if(currentIndex < venueList.length){
        getVenueInfo(venueList[currentIndex])
    }
    currentIndex++;

}

$(document).ready(function(){
    currentIndex = 0;
    getVenues();
});
