// wishlist: hAudio or RDFa markup

function findArtists(selector) {
	var nodes = document.querySelectorAll(selector.artist);

	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		if (!node.getAttribute("href").match(/^\/music\/[^\/]+$/)) continue;

		var artist = node.textContent.trim();
		if(!artist) continue;

		addTomahawkArtistLink(node.appendChild(document.createElement("div")), artist);
		addSpotifyArtistLink(node.appendChild(document.createElement("div")), artist);
	}
}

findArtists({
	artist: "a[href^='/music/']"
});

function addTomahawkArtistLink(node, artist, title) {
	var link = document.createElement("a");
	//link.href = "tomahawk://open/track" + buildQueryString({ artist: artist, title: title });
	link.href = "tomahawk://view/artist" + buildQueryString({ name: artist });
	link.innerHTML = "▶";
	link.style.background = "url(http://www.tomahawk-player.org/sites/default/files/favicon.ico) no-repeat right center";
	link.style.paddingRight = "20px";

	node.appendChild(link);
}

function addSpotifyArtistLink(node, artist, title) {
	var query = 'artist:"' + artist + '"';

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://ws.spotify.com/search/1/artist.json" + buildQueryString({ q: query }), true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			var data = JSON.parse(xhr.responseText);
			if (!data.artists || !data.artists.length) return;

			var link = document.createElement("a");
			link.href = data.artists[0].href;
			link.innerHTML = "▶";
			link.style.background = "url(http://cf.scdn.co/i/favicon.ico) no-repeat right center";
			link.style.paddingRight = "20px";
			link.style.backgroundSize = "16px 16px";

			node.appendChild(link);
		}
	};
	xhr.send(null);
}

function buildQueryString(items) {
	var parts = [];

	var add = function(key, value) {
		parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
	}

	for (var key in items) {
		if (!items.hasOwnProperty(key)) continue;

   		var obj = items[key];

   		if (Array.isArray(obj)) {
   			obj.forEach(function(value) {
   				add(key, value);
   			});
   		}
   		else {
   			add(key, obj);
   		}
	}

	return parts.length ? "?" + parts.join("&").replace(/%20/g, "+") : "";
}
