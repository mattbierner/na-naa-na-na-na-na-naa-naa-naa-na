import React from 'react';
import ReactDOM from 'react-dom';

import OptionsPanel from './controls/options_panel';
import RangeInput from './controls/range_input';
import ColorInput from './controls/color_input';

/**
 * Main options panel.
 */
export default class MainOptionsPanel extends React.Component {
    render() {
        return (
            <OptionsPanel>
                <RangeInput label='Edge Thickness'
                    unit='%'
                    min="1"
                    max="100"
                    value={this.props.edging}
                    onChange={this.props.onEdgingChange} />

                <RangeInput label='Opacity'
                    unit='%'
                    min="1"
                    max="100"
                    value={this.props.opacity}
                    onChange={this.props.onOpacityChange} />
                
                <RangeInput label='Inner Radius'
                    unit='%'
                    min="1"
                    max="100"
                    value={this.props.innerRadius}
                    onChange={this.props.onInnerRadiusChange} />
                
                <ColorInput label='Start Color'
                    value={this.props.startColor}
                    onChange={this.props.onStartColorChange} />

                <ColorInput label='End Color'
                    value={this.props.endColor}
                    onChange={this.props.onEndColorChange} />
                
                <div className="credits">
                    &copy; 2016 <a href="http://mattbierner.com">Matt Bierner</a>
                </div>

            </OptionsPanel>
        );
    }
}
