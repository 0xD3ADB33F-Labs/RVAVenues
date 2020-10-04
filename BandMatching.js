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

	for(var i = 0; i<VenueList.length; i++){
		//TODO: Compare song attributes against Venue attributes.
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
	console.log("Search: " + $(this).attr("data-song-id"));
	GetTrackFeatures($(this).attr("data-song-id"));
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
		newTrack.attr("id", "track-info-" + track.id);
		newTrack.find("#track-name").text(track.name);
		newTrack.find("#track-artist").text(artists);
		newTrack.find("#album-art").attr("src", track.album.images[0].url);
		newTrack.removeClass("hide");
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