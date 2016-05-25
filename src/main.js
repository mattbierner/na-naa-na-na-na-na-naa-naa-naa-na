const React = require('react');
const ReactDOM = require('react-dom');

import GameView from './game_view';

import {getData} from './data';


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    componentWillMount() {
        getData('examples/katamari/sumo.json')
            .then(data => {
                this.setState({
                    data: data.events.map(x => ({
                        x: x.left_x,
                        y: x.left_y
                    }))
                });
            })
            .catch(e => console.error(e));

    }

    render() {
        return (
            <div className="main container">
                <GameView data={this.state.data}/>
            </div>);
    }
};


ReactDOM.render(
    <Main />,
    document.getElementById('content'));