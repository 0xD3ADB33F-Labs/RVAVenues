const SearchButtonID = "#SearchButton";
const SearchTrackID = "#SongName";
const TrackListID = "#TracksList";
const SpotifyAPIKey = "Bearer BQCwP3Ugei1u3DIiXQn9DUmrKUX4eZbxfZJIcTni6Ax8onlxLFTbnXVxo3xftF_8G_t0h_iJI3qXD0s_fzJbueUwrRowRdh161ssqhnnKRejKKeAlW9VGhY-tXlrjVQnSTyie-Ju7_kHs0I";
const SpotifyHeader = {
	Accept: "application/json",
	"Content-Type": "application/json",
	Authorization: SpotifyAPIKey
};

var TrackToMatch = {};

function GetTrackFeatures(id, obj){
	
}

function MatchVenueToSong(songid) {
	TrackToMatch.id = songid;
	GetTrackFeatures(songid, TrackToMatch);

}

function songClicked(ev) {
	ev.preventDefault();
	console.log("Search: " + $(this).attr("data-song-id"));
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

$(document).ready(function () {
	$(SearchButtonID).click(function (ev) {
		ev.preventDefault();
		SearchSpotify($(SearchTrackID).val());
	});
});