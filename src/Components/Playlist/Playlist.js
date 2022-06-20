import React from 'react';
import { TrackList } from './../TrackList/TrackList';
import { Spotify } from './../../util/Spotify';
import './Playlist.css';

export class Playlist extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playlists: null
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePlaylistSelect = this.handlePlaylistSelect.bind(this);
    }

    handleNameChange(e) {
        this.props.onNameChange(e.target.value);
    }

    async getPlaylists() {
        let playlists = await Spotify.getPlaylists();
        let myLists = playlists.map(playlist => <option key={playlist.id} value={playlist.id}>{playlist.name}</option>);
        this.setState({
            playlists: myLists
        });
    }

    componentDidMount() {
        this.getPlaylists();
    }

    handlePlaylistSelect(e) {
        if (e.target.value === "New Playlist") {
            document.getElementById("New-PL-name").style.display = "block";
            document.getElementById("New-PL-name").value = "";
        }
        else {
            document.getElementById("New-PL-name").style.display = "none";
            document.getElementById("New-PL-name").value = e.target.value;
        }
        console.log(e);
        this.props.onPlaylistSelect(e.target.value, e.target.selectedOptions[0].text);
    }

    render() {
        return (
            <div className="Playlist">
                <h2>Playlists</h2>
                <select id="Playlist-select" onChange={this.handlePlaylistSelect} className="Playlist-select">
                    {this.state.playlists}
                    <option value="New Playlist">New Playlist</option>
                </select>
                <input id="New-PL-name" placeholder='Enter Playlist Name' onChange={this.handleNameChange}/>
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} onPreview={this.props.onPreview} previewURI={this.props.previewURI}/>
                <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
}