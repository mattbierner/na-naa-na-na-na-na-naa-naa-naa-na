import React from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';

import Viewer from './game_3d_view';
import ViewControls from './controls/view_controls';

/**
 * View for a complete game.
 */
export default class GameView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (this._3dview)
            return;

        const element = ReactDOM.findDOMNode(this);
        const canvas = element.getElementsByClassName('glCanvas')[0];
        this._3dview = new Viewer(canvas, element);
        this._3dview.setColors(
            new THREE.Vector4(1, 0, 1, 1),
            new THREE.Vector4(0, 1, 1, 1));
    }

    componentWillReceiveProps(newProps) {
        if (newProps.game && this.props.game !== newProps.game) {
            this._3dview.draw(newProps.game.events);
        }
        if (newProps.progress != this.props.progress && typeof newProps.progress !== 'undefined') {
            this._3dview.setProgress(newProps.progress);
        }
    }

    resetView() {
        if (!this._3dview)
            return;
        this._3dview.resetView();
    }

    render() {
        return (
            <div className="game-view">
                <ViewControls resetView={this.resetView.bind(this)}/>
                <canvas className='glCanvas' />
            </div>
        );
    }
}
