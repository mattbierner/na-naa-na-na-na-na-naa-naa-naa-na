import React from 'react';
import ReactDOM from 'react-dom';

export default class RangeInput extends React.Component {
    onChange(e) {
        this.props.onChange(e.target.value);
    }

    render() {
        return (
            <div className="color-control">
                <div className='label'>{this.props.label}</div>
                <input type="color" value={this.props.value} onChange={this.onChange.bind(this)} />
            </div>
        );
    }
}; 
