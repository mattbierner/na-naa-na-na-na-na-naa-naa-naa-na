"use strict";
const React = require('react');
const ReactDOM = require('react-dom');

/**
 * Collapsible side panel containing a set of options.
 */
export default class OptionsPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            implicit: true
        };
    }
    
    onSettingsButtonClick() {
        this.setState({ active: !this.state.active, implicit: false });
    }
    
    onCloseButtonClick() {
        this.setState({ active: false, implicit: false });
    }
    
    render() {
        const classes = [];
        if (this.state.implicit)
            classes.push('implicit');
        if (this.state.active)
            classes.push('active');
        
        return (
            <div className={'side-panel ' + classes.join(' ')}>
                <button className="panel-settings-button material-icons"
                    onClick={this.onSettingsButtonClick.bind(this)}>settings
                </button>
                <button className="panel-close-button material-icons"
                    onClick={this.onCloseButtonClick.bind(this)}>clear
                </button>
                <div className="panel-contents">
                    <h1>Options</h1>
                    {this.props.children}
                </div>
            </div>);
    }
}; 
