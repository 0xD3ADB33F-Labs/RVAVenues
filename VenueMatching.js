
var Artists = [];

function AverageVenue(){
	var curVenue = {};
	var numOfArtists = 0;

	curVenue.avgDance = 0;
	curVenue.avgEnergy = 0;
	curVenue.avgSpeech = 0;
	curVenue.avgAcoustic = 0;
	curVenue.avgInstru = 0;
	curVenue.avgLive = 0;
	curVenue.avgValence = 0;

	for(var i in Artists){
		curVenue.avgDance += Artists[i].avgDance;
		curVenue.avgEnergy += Artists[i].avgEnergy;
		curVenue.avgSpeech += Artists[i].avgSpeech;
		curVenue.avgAcoustic += Artists[i].avgAcoustic;
		curVenue.avgInstru += Artists[i].avgInstru;
		curVenue.avgLive += Artists[i].avgLive;
		curVenue.avgValence += Artists[i].avgValence;
		numOfArtists++;
	}

	curVenue.avgDance = curVenue.avgDance/numOfArtists;
	curVenue.avgEnergy = curVenue.avgEnergy/numOfArtists;
	curVenue.avgSpeech = curVenue.avgSpeech/numOfArtists;
	curVenue.avgAcoustic = curVenue.avgAcoustic/numOfArtists;
	curVenue.avgInstru = curVenue.avgInstru/numOfArtists;
	curVenue.avgLive = curVenue.avgLive/numOfArtists;
	curVenue.avgValence = curVenue.avgValence/numOfArtists;

	console.log(curVenue);

	$("#output").text(JSON.stringify(curVenue, null, 5));

}

function CalculateArtistAverage(artID){
	var curArt = Artists[artID];
	var numofTracks = Artists[artID].tracks.length;

	curArt.avgDance = 0;
	curArt.avgEnergy = 0;
	curArt.avgSpeech = 0;
	curArt.avgAcoustic = 0;
	curArt.avgInstru = 0;
	curArt.avgLive = 0;
	curArt.avgValence = 0;
	

	for(var i=0;i<numofTracks; i++){
		curArt.avgDance += curArt.tracks[i].danceability;
		curArt.avgEnergy += curArt.tracks[i].energy;
		curArt.avgSpeech += curArt.tracks[i].speechiness;
		curArt.avgAcoustic += curArt.tracks[i].acousticness;
		curArt.avgInstru += curArt.tracks[i].instrumentalness;
		curArt.avgLive += curArt.tracks[i].liveness;
		curArt.avgValence += curArt.tracks[i].valence;
	}

	curArt.avgDance = curArt.avgDance/numofTracks;
	curArt.avgEnergy = curArt.avgEnergy/numofTracks;
	curArt.avgSpeech = curArt.avgSpeech/numofTracks;
	curArt.avgAcoustic = curArt.avgAcoustic/numofTracks;
	curArt.avgInstru = curArt.avgInstru/numofTracks;
	curArt.avgLive = curArt.avgLive/numofTracks;
	curArt.avgValence = curArt.avgValence/numofTracks;

	curArt.calculated = true;


	console.log(artID);
	console.log(curArt);

	for(var artist in Artists){
		if(Artists[artist].calculated != true){
			return;
		}
	}

	AverageVenue();

}

function ProcessTrackResults(results, artistID){
	var curTrack = {};

	curTrack.danceability = results.danceability;
	curTrack.energy = results.energy;
	curTrack.speechiness = results.speechiness;
	curTrack.acousticness = results.acousticness;
	curTrack.instrumentalness = results.instrumentalness;
	curTrack.liveness = results.liveness;
	curTrack.valence = results.valence;


	Artists[artistID].tracks.push(curTrack);

	if(Artists[artistID].tracks.length == Artists[artistID].topTrackNum){
		CalculateArtistAverage(artistID);
	}
}

function RetrievedBandTopTracks(results, artistID){
	console.log(results);
	Artists[artistID].topTrackNum = results.tracks.length;
	for(var i=0; i<results.tracks.length; i++){
		var url = "https://api.spotify.com/v1/audio-features/"+results.tracks[i].id;
		$.ajax(url, {
			headers: SpotifyHeader
		}).done(function(results){
			ProcessTrackResults(results, artistID);
		});
	}
}

function BandResults(results){
	console.log(results);
	var artistID = results.artists.items[0].id;
	console.log(artistID);
	Artists[artistID] = { name: results.artists.items[0].name, tracks: []};
	var url = `https://api.spotify.com/v1/artists/${artistID}/top-tracks?country=us`;
	$.ajax(url, {
		headers: SpotifyHeader
	}).done(function(results){
		RetrievedBandTopTracks(results, artistID);
	});
}

function GetBand(bandName){
	var url = `https://api.spotify.com/v1/search?q=${bandName}&type=artist&market=US&limit=20`;
	$.ajax(url, {
		headers: SpotifyHeader
	}).done(BandResults);
}

function CalVenue(event){
	event.preventDefault();
	console.log("Calculating Venue")
	Artists = [];
	for(var i = 1; i <= 10; i++){
		var bandInput = $("#Band"+i);
		if(!(bandInput.val().trim() === "")){
			GetBand(bandInput.val());
		}else{
			console.log(bandInput.val());
		}
	}
}

$(document).ready(function(){
	$("#CalVenue").click(CalVenue);
});