let userAccessToken;

const CLIENT_ID = "d6df7b750d4444cb8161b4e06622b1d9";
const REDIRECT_URI = "http://localhost:3000" //https:JTTestJamming.surge.sh";

const Spotify = {
    getAccessToken() {
        if (userAccessToken) {
            return userAccessToken;
        };

        let testToken = window.location.href.match(/access_token=([^&]*)/);
        let testExpire = window.location.href.match(/expires_in=([^&]*)/);
        if(testToken && testExpire) {
            userAccessToken = testToken[1];
            const tokenExpiry = testExpire[1]
            window.setTimeout(() => userAccessToken = "", tokenExpiry * 1000);
            window.history.pushState('Access Token', null, '/');
            return userAccessToken;
        }
        else{
            window.location = "https://accounts.spotify.com/authorize?client_id=" + CLIENT_ID + "&response_type=token&scope=playlist-modify-public&redirect_uri=" + REDIRECT_URI;
        }
    },
    
    async search(searchTerm) {
        let response = await fetch("https://api.spotify.com/v1/search?type=track&q=" + searchTerm, {
            headers: {
                Authorization: `Bearer ${this.getAccessToken()}`
            }
        })
        let jsonResponse = await response.json();
        
        if(!jsonResponse.tracks) {return []};
        return jsonResponse.tracks.items.map(track => ({id: track.id, name: track.name, album: track.album.name, artist: track.artists.map(artist => artist.name).join(", "), uri: track.uri, preview: track.preview_url}));
    },

    async savePlaylist(name, tracks, id) {
        if(!name || !tracks) { return; };

        //Get token and set header for authorisation
        const token = await this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${token}`
        };
        let userID;

        //Get current user
        try {
            let response = await fetch("https://api.spotify.com/v1/me", {
                headers: headers
            })
            let jsonResponse = await response.json();
            userID = jsonResponse.id;

            let playlistID;
        //Create new playlist for user, if new
            if(id === "New Playlist") {
                response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({
                        name: name
                    })
                })
                jsonResponse = await response.json();
                playlistID = jsonResponse.id;
            }
            else {
                playlistID = id;
            }

            //Update playlist tracks
            fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify({
                    uris: tracks
                })
            })

            return playlistID;

        }
        catch(error) {
            console.log(error.message);
        }
    },

    async getPlaylists() {
        const token = await this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${token}`
        };
        let userID;
        
        try {
            let response = await fetch("https://api.spotify.com/v1/me", {
                headers: headers
            })
            let jsonResponse = await response.json();
            userID = jsonResponse.id;

            response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: "GET",
                headers: headers
            })
            let playlists = await response.json();
            
            return playlists.items;
        }
        catch(error) {
            console.log(error.message);
        }
    },

    async getPlaylistTracks(id) {
        const token = await this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${token}`
        };
        
        try {
            let response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
                headers: headers
            })
            let jsonResponse = await response.json();
            return jsonResponse.items.map(item => ({id: item.track.id, name: item.track.name, album: item.track.album.name, artist: item.track.artists.map(artist => artist.name).join(", "), uri: item.track.uri, preview: item.track.preview_url}));
        }
        catch(error) {
            console.log(error.message);
        }
    }
};

export {Spotify}