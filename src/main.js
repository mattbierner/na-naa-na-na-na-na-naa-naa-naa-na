import React from 'react';
import ReactDOM from 'react-dom';

import GameView from './game_view';
import Header from './header';
import Controls from './controls';

import {getData} from './data';


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game: null,
            progress: 0
        };
    }

    componentWillMount() {
        getData('examples/katamari/sumo.json')
            .then(game => {
                this.setState({ game });
            })
            .catch(e => console.error(e));
    }

    onPositionChange(progress) {
        this.setState({ progress });
    }

    render() {
        return (
            <div className="main container">
                <Header />
                <GameView game={this.state.game}  progress={this.state.progress}/>
                <Controls
                    duration={this.state.game ? this.state.game.duration : 0}
                    progress={this.state.progress}
                    onPositionChange={this.onPositionChange.bind(this)} />
            </div>);
    }
};


ReactDOM.render(
    <Main />,
    document.getElementById('content'));