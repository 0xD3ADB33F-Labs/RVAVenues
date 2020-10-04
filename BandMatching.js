const SearchButtonID = "#SearchButton";
const SearchTrackID = "#SongName";
const TrackListID = "#TracksList";
const SpotifyAPIKey = "Basic MDYyNjU3NTEyMDBhNGYxNmIzZWQ2ZTY5ZjRlY2M4MTY6YzAzNzg3OTZlNTZjNGI1YzkxMmJkMDYyZDNmMzU3ZmE=";
var SpotifyAccessToken = "Bearer ahgfadhnjko;failhasduiofhbdjilsa";
var SpotifyHeader = {
	Accept: "application/json",
	"Content-Type": "application/json",
	Authorization: SpotifyAccessToken
};

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
	$(TrackListID).empty();
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
		var songString = `${track.name} : ${artists}`;
		var listItem = $("<li>");
		var buttonItem = $("<button>");
		buttonItem.text(songString);
		buttonItem.attr("data-song-id", track.id);
		buttonItem.click(songClicked);
		listItem.append(buttonItem);
		$(TrackListID).append(listItem);
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