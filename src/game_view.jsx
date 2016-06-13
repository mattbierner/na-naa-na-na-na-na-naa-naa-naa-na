import React from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';

import Viewer from './game_3d_view';
import ViewControls from './controls/view_controls';

/**
 * Convert hex color string to Vec4 color.
 */
const hexToVec4 = hex => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return new THREE.Vector4(parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255, 1);
};

/**
 * View for a complete game.
 */
export default class GameView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autoRotate: true
        };
    }

    componentDidMount() {
        if (this._3dview)
            return;

        const element = ReactDOM.findDOMNode(this);
        const canvas = element.getElementsByClassName('glCanvas')[0];
        this._3dview = new Viewer(canvas, element);
        this._3dview.setAutoRotate(this.state.autoRotate);

        this.updateOptions(this.props);
    }

    componentWillReceiveProps(newProps) {
        if ((newProps.game && this.props.game !== newProps.game) || (this.props.translationScaling !== newProps.translationScaling)) {
            this._3dview.draw(newProps.game.events, 1 / newProps.translationScaling);
        }
        
        this._3dview.setProgress(newProps.progress);

        this.updateOptions(newProps);
    }

    updateOptions(props) {
        this._3dview.setEdging(props.edging);
        this._3dview.setOpacity(props.opacity);
        this._3dview.setInnerRadius(props.innerRadius);
        this._3dview.setColors(hexToVec4(props.startColor), hexToVec4(props.endColor));
    }

    resetView() {
        if (!this._3dview)
            return;
        this._3dview.resetView();
    }

    onAutoRotateChange(value) {
        this._3dview.setAutoRotate(value);
        this.setState({ autoRotate: value });
    }

    render() {
        return (
            <div className="game-view">
                <ViewControls resetView={this.resetView.bind(this)} autoRotate={this.state.autoRotate}
                    onAutoRotateChange={this.onAutoRotateChange.bind(this)}/>
                <canvas className='glCanvas' />
            </div>
        );
    }
}
