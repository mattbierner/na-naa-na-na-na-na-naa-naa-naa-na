import React from 'react';
import ReactDOM from 'react-dom';

import GameView from './game_view';
import Header from './header';
import {getData} from './data';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game: null
        };
    }

    componentWillMount() {
        getData('examples/katamari/sumo.json')
            .then(game => {
                this.setState({ game });
            })
            .catch(e => console.error(e));

    }

    render() {
        return (
            <div className="main container">
                <Header />
                <GameView game={this.state.game}/>
            </div>);
    }
};


ReactDOM.render(
    <Main />,
    document.getElementById('content'));