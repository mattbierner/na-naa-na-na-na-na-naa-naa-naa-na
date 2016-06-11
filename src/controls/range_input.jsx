import React from 'react';
import ReactDOM from 'react-dom';

export default class RangeInput extends React.Component {
    onChange(e) {
        this.props.onChange(e.target.value);
    }

    render() {
        return (
            <div className="range-control">
                <div className='label'>{this.props.label}</div>
                <input type="range"
                    min={this.props.min} max={this.props.max} value={this.props.value} onChange={this.onChange.bind(this)} />
                <div className="labels">
                    <span className='min-label'>{this.props.min}</span>
                    <span className='max-label'>{this.props.max}</span>
                    <span className='value-label'>{this.props.value + (this.props.unit || '')}</span>
                </div>
            </div>
        );
    }
}; 
