import React from 'react';
import './App.css';
import { SearchBar } from '../../Components/SearchBar/SearchBar';
import { SearchResults } from '../../Components/SearchResults/SearchResults';
import { Playlist } from '../../Components/Playlist/Playlist';
import { Spotify } from './../../util/Spotify';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCirclePlay, faCircleStop } from '@fortawesome/free-solid-svg-icons';

library.add(faCirclePlay, faCircleStop)

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "",
      playlistTracks: [],
      playlistID: "New Playlist",
      previewTrack: null,
      previewAudio: null
    };
    Spotify.getAccessToken();
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.previewSong = this.previewSong.bind(this);
    this.getPlaylist = this.getPlaylist.bind(this);
    this.timeOutID = null;
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    let newPlaylist = this.state.playlistTracks;
    newPlaylist.push(track);

    this.setState({
      playlistTracks: newPlaylist
    })
  }

  removeTrack(track) {
    let newPlaylist = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({
      playlistTracks: newPlaylist
    })
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name,
    })
  }

  async savePlaylist(playlistID) {
    if (!this.state.playlistName) {return};
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs, this.state.playlistID)
    .then(newID => {
      this.setState({
        playlistID: newID,
      });
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm)
    .then(response => {
      this.setState({searchResults: response});
    });
    
  }

  previewSong(audio, uri) {

    if (this.state.previewAudio !== null) {
      this.state.previewAudio.pause();
      let newAudio = this.state.previewAudio;
      newAudio.currentTime = 0;
      this.setState({
        previewAudio: newAudio
      })
      clearTimeout(this.timeOutID);
    }

    if (this.state.previewTrack === uri) {
      this.setState({
        previewTrack: null,
        previewAudio: null
      });
      return;
    }

    this.setState({
      previewTrack: uri,
      previewAudio: audio
    });

    audio.play();
    this.timeOutID = setTimeout(() => this.setState({
      previewTrack: null,
      previewAudio: null
    }), 30000)
  }

  getPlaylist(id, name) {
    if (id === "New Playlist") {
      this.setState({
        playlistID: "New Playlist",
        playlistTracks: [],
        playlistName: ""
      })
      return;
    }

    this.updatePlaylistName(name);
    Spotify.getPlaylistTracks(id)
    .then(response => {
      this.setState({
        playlistID: id,
        playlistTracks: response
      })
    });

  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} 
                           onAdd={this.addTrack}
                           onPreview={this.previewSong}
                           previewURI={this.state.previewTrack}/>
            <Playlist playlistID={this.state.playlistID}
                      playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks} 
                      onRemove={this.removeTrack} 
                      onNameChange={this.updatePlaylistName} 
                      onSave={this.savePlaylist}
                      onPreview={this.previewSong}
                      onPlaylistSelect={this.getPlaylist}
                      previewURI={this.state.previewTrack}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
