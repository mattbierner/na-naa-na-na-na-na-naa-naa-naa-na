const React = require('react');
const ReactDOM = require('react-dom');

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
        this._3dview.draw(0x0000ff, newProps.data || []);
    }

    render() {
        return (
            <div className="game-view">
                <canvas className='glCanvas' />
            </div>);
    }
}
