import React from 'react';
import ReactDOM from 'react-dom';

import GameSelector from './game_selector';
import Timeline from './timeline';
import PlaybackSpeedControls from './playback_speed_controls';

/**
 * Number of ms between timeline position update checks.
 */
const UPDATE_INTERVAL = 30;

/**
 * 
 */
export default class Controls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            dragging: false,
            playbackSpeed: 8
        };

        this._onKeyDown = (e) => {
            if (e.keyCode === 32)
                this.toggle();
        };
    }

    componentDidMount() {
        window.removeEventListener('keypress', this._onKeyDown);
        window.addEventListener('keypress', this._onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this._onKeyDown);
    }


    componentWillReceiveProps(newProps) {
        if (newProps.game && this.props.game !== newProps.game) {
            this.play();
        }
    }

    play() {
        if (this.state.playing)
            return;
        
        this.setState({ playing: true });

        const self = this;
        (function loop(when) {
            var _start = Date.now();
            setTimeout(() => {
                if (!self.state.playing)
                    return;
                
                const actual = Date.now() - _start;
                const next = Math.max(0, UPDATE_INTERVAL - (actual - UPDATE_INTERVAL));
                
                if (!self.state.dragging) {
                    const progress = self.props.progress + self.state.playbackSpeed * (actual / self.props.duration);
                    self.props.onPositionChange(Math.max(0, Math.min(1, progress)));
                    if (progress >= 1) {
                        self.setState({ playing: false });
                        return;
                    }
                }
                loop(next);
            }, when);
        } (UPDATE_INTERVAL));
        
        this.props.onPlay && this.props.onPlay();
    }

    onTimelineDrag(progress, done) {
        this.setState({
            dragging: !done
        });

        if (this.props.onPositionChange) {
            this.props.onPositionChange(progress);
        }
    }

    onTimelineDragDone(progress) {
        this.onTimelineDrag(progress, true);
    }

    pause() {
        this.setState({ playing: false });
        this.props.onPause && this.props.onPause();
    }

    onPlaybackSpeedChange(speed) {
        this.setState({ playbackSpeed: speed });
    }

    toggle() {
        if (this.state.playing)
            this.pause();
        else
            this.play();
    }

    goToStart() {
        this.props.onPositionChange(0);
    }

    goToEnd() {
        this.props.onPositionChange(1);
    }

    render() {
        return (
            <div id="controls">
                <div id="playback-controls">
                    <GameSelector games={this.props.games} onChange={this.props.onGameChange} gameFile={this.props.gameFile} />
                    <div className="player-controls">
                        <div className="button-group">
                            <button onClick={this.goToStart.bind(this) } className='material-icons'>skip_previous</button>
                        </div>
                        <div className="button-group">
                            <button onClick={this.toggle.bind(this) } className='material-icons'>{this.state.playing ? 'pause' : 'play_arrow'}</button>
                        </div>
                        <div className="button-group">
                            <button onClick={this.goToEnd.bind(this) } className='material-icons'>skip_next</button>
                        </div>
                    </div>
                    <PlaybackSpeedControls onChange={this.onPlaybackSpeedChange.bind(this) } value={this.state.playbackSpeed}  />
                </div>
                <Timeline {...this.props}
                    onDrag={this.onTimelineDrag.bind(this) }
                    onDragDone={this.onTimelineDragDone.bind(this) } />
            </div>);
    }
}; 
