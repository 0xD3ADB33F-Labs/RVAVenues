const SearchButtonID = "#SearchButton";
const SearchTrackID = "#user-song";
const TrackListID = "#Track-Options";
const SpotifyAPIKey = "Basic MDYyNjU3NTEyMDBhNGYxNmIzZWQ2ZTY5ZjRlY2M4MTY6YzAzNzg3OTZlNTZjNGI1YzkxMmJkMDYyZDNmMzU3ZmE=";
var SpotifyAccessToken = "Bearer ahgfadhnjko;failhasduiofhbdjilsa";
var SpotifyHeader = {
	Accept: "application/json",
	"Content-Type": "application/json",
	Authorization: SpotifyAccessToken
};

$(document).ready(function () {
	$(".modal").modal();
})

var TrackToMatch = {};

function RetrievedTrackInfo(results){
	console.log(results);

	var acousticDif = 0;
	var danceDif = 0;
	var energyDif = 0;
	var instrumentalDif = 0;
	var liveDif = 0;
	var speechDif = 0;
	var valenceDif = 0;



	for(id in VenueList){
		var venue = VenueList[id];
		acousticDif = Math.abs(results.acousticness - venue.avgAcoustic);
		danceDif = Math.abs(results.danceability - venue.avgDance);
		energyDif = Math.abs(results.energy - venue.avgEnergy);
		liveDif = Math.abs(results.liveness - venue.avgLive);
		instrumentalDif = Math.abs(results.instrumentalness - venue.avgInstru);
		speechDif = Math.abs(results.speechiness - venue.avgSpeech);
		valenceDif = Math.abs(results.valence - venue. avgValence);
		
		console.log(acousticDif);


		var Compatibiliy = 0;
		Compatibiliy += acousticDif;
		Compatibiliy += danceDif;
		Compatibiliy += energyDif;
		Compatibiliy += liveDif;
		Compatibiliy += instrumentalDif;
		Compatibiliy += speechDif;
		Compatibiliy += valenceDif;
		Compatibiliy /= 7;
		venue.Compatibiliy = Compatibiliy;
		console.log(venue.name + " : " + venue.Compatibiliy);
	}



	SortAndDisplay();
}

function GetTrackFeatures(id, obj) {
	console.log(id);
	var url = "https://api.spotify.com/v1/audio-features/"+id;
	$.ajax(url, {
		headers: SpotifyHeader
	}).done(RetrievedTrackInfo);
}

function MatchVenueToSong(songid) {
	TrackToMatch.id = songid;
	GetTrackFeatures(songid, TrackToMatch);

}

function songClicked(ev) {
	ev.preventDefault();
	console.log("Search: " + $(this).attr("data-track-id"));
	GetTrackFeatures($(this).attr("data-track-id"));
}

function ProcessResults(results) {
	console.log(results);
	var trackArray = results.tracks.items;
	for (var i = 0; i < trackArray.length; i++) {
		var track = trackArray[i];
		var artists = "";
		for (var k = 0; k < track.artists.length; k++) {
			if (k === 0) {
				artists += track.artists[k].name;
			} else {
				artists += ", " + track.artists[k].name;
			}
		}
		var newTrack = $("#track-suggestion-template").clone();
		newTrack.attr("id", "track-id-" + track.id);
		newTrack.attr("data-track-id", track.id);
		newTrack.find("#track-name").text(track.name);
		newTrack.find("#track-artist").text(artists);
		newTrack.find("#album-art").attr("src", track.album.images[2].url);
		newTrack.removeClass("hide");
		newTrack.on("click", songClicked);
		$("#Track-Options").append(newTrack);
	}
}

function SearchSpotify(trackName) {
	var url = `https://api.spotify.com/v1/search?q=${trackName}&type=track&market=US&limit=20`;
	$.ajax(url, {
		headers: SpotifyHeader
	}).done(ProcessResults);
}

function RetrievedAccessToken(results) {
	SpotifyHeader.Authorization = "Bearer " + results.access_token;
	console.log(SpotifyHeader.Authorization);
}

function GetAccessToken() {
	var url = "https://accounts.spotify.com/api/token";
	$.ajax(url, {
		method: "POST",
		headers: {
			Authorization: SpotifyAPIKey
		},
		data: "grant_type=client_credentials"
	}).done(RetrievedAccessToken);

}

$(document).ready(function () {
	$(SearchButtonID).click(function (ev) {
		ev.preventDefault();
		SearchSpotify($(SearchTrackID).val());
	});

	GetAccessToken();
});