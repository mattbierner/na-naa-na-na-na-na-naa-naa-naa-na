import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Playback speed selector.
 * 
 * Provides set of default speed plus ability to enter custom speed.
 */
export default class PlaybackSpeedControls extends React.Component {
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
        if (isNaN(num)) 
            return false;
        
        if (num <= 0 || num > 20) 
            return false;
        
        this.setState({ speed: num });
        this.props.onChange(+num);
        return true;
    }

    render() {
        return (
            <span className="selector-control">
                Speed:
                <select style={{ zIndex: 999 }} className="speed-selector" onChange={this.onChange.bind(this) } value={this.state.value} tabindex="-1">
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