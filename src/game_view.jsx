import React from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';

import Viewer from './3d_view';

/**
 * 
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
    }

    componentWillReceiveProps(newProps) {
        if (newProps.game && this.props.game !== newProps.game) {
            this._3dview.draw(newProps.game.events, 'left_x', 'left_y', 'right_x', 'right_y',
                new THREE.Vector4(1, 0, 1, 1),
                new THREE.Vector4(0, 1, 1, 1));
        }
    }

    render() {
        return (
            <div className="game-view">
                <canvas className='glCanvas' />
            </div>);
    }
}
