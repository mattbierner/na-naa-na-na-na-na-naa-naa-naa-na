import React from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';
import processRow from './process/row';
import Viewer from './stream_3d_view';

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
        this._socket = new WebSocket('ws://localhost:8000');
        this._socket.onmessage = (e) => {
            this._3dview.draw(processRow(e.data));
        };
    }

    render() {
        return (
            <div className="game-view">
                <canvas className='glCanvas' />
            </div>);
    }
}
