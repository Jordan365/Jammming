import React from 'react';
import './Track.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class Track extends React.Component {

    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.previewClick = this.previewClick.bind(this);
    }
    
    renderAction() {
        if (this.props.isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>
        }
        else {
            return <button className="Track-action" onClick={this.addTrack}>+</button>
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    previewClick(e) {
        this.props.onPreview(document.getElementById(this.props.track.uri), this.props.track.uri)
    }

    render() {
        return(
            <div className="Track">
                <audio hidden id={this.props.track.uri} src={this.props.track.preview} type="audio/mpeg"></audio>
                <button className="Track-preview" onClick={this.previewClick}><FontAwesomeIcon icon={this.props.previewURI === this.props.track.uri ? "circle-stop" : "circle-play"} /></button>
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                {this.renderAction()}
            </div>
        );
    }
}