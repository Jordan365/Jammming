import React from 'react';
import './App.css';
import '../../Components/SearchBar/SearchBar'
import '../../Components/SearchResults/SearchResults'
import '../../Components/Playlist/Playlist'
import { SearchBar } from '../../Components/SearchBar/SearchBar';
import { SearchResults } from '../../Components/SearchResults/SearchResults';
import { Playlist } from '../../Components/Playlist/Playlist';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        {name: "name1", artist: "artist1", album: "album1", id: 1},
        {name: "name2", artist: "artist2", album: "album2", id: 2},
        {name: "name3", artist: "artist3", album: "album3", id: 3}
      ],
      playlistName: "MyPlaylist",
      playlistTracks: [
        {name: "name4", artist: "artist1", album: "album1", id: 4},
        {name: "name5", artist: "artist2", album: "album2", id: 5},
        {name: "name6", artist: "artist3", album: "album3", id: 6}
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
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
      playlistName: name
    })
    console.log(name);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
