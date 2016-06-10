import React from 'react';
import ReactDOM from 'react-dom';

import Timeline from './timeline';

const interval = 30;
const SCALE = 20;

const tryInvoke = (f, x) =>
    f ? f(x) : null;

/**
 * 
 */
class PlaybackSpeedControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            speed: +props.value,
            value: props.value || '1',
            customValue: '1',
            custom: false
        };
    }

    onChange(e) {
        const value = e.target.value;
        if (value === 'custom') {
            if (+this.state.value)
                this.props.onChange(+value);

            this.setState({ value: 'custom', custom: true });
            this.setValue(this.state.customValue);
        } else {
            this.setState({ value: value, custom: false, customValue: value });
            this.setValue(value);
        }
    }

    onCustomChange(e) {
        const value = e.target.value;
        this.setValue(value);
        this.setState({ customValue: value });
    }

    setValue(value) {
        const num = +value;
        if (isNaN(num)) {
            //this.
            return false;
        }
        if (num <= 0 || num > 20) {
            return false;
        }
        this.setState({ speed: num });
        this.props.onChange(+num);
        return true;
    }

    render() {
        return (
            <span className="control">
                Speed:
                <select style={{ zIndex: 999 }} className="speed-selector" onChange={this.onChange.bind(this) } value={this.state.value}>
                    <option value="1">1x</option>
                    <option value="2">2x</option>
                    <option value="4">4x</option>
                    <option value="8">8x</option>
                    <option value="20">20x</option>
                    <option value="custom">custom</option>
                </select>
                <input type="text" className={this.state.custom ? '' : 'hidden'}
                    value={this.state.customValue}
                    onChange={this.onCustomChange.bind(this) } />
            </span>
        );
    }
}

/**
 * 
 */
export default class Controls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            dragging: false,
            playbackSpeed: 1
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
                const next = Math.max(0, interval - (actual - interval));
                
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
        } (interval));
        
        this.props.onPlay && this.props.onPlay();
    }

    onTimelineDrag(progress, done) {
        this.setState({
            dragging: !done
        });

        if (this.props.onPositionChange) {
            this.props.onPositionChange(progress)
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

    render() {
        return (
            <div id="controls">
                <div id="playback-controls">
                    <div className="button-group">
                        <button onClick={this.toggle.bind(this) } className='material-icons'>{this.state.playing ? 'pause' : 'play_arrow'}</button>
                    </div>
                    <PlaybackSpeedControls onChange={this.onPlaybackSpeedChange.bind(this) } />
                </div>
                <Timeline {...this.props}
                    onDrag={this.onTimelineDrag.bind(this) }
                    onDragDone={this.onTimelineDragDone.bind(this) } />
            </div>);
    }
}; 
