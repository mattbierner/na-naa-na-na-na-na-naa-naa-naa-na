import React from 'react';
import ReactDOM from 'react-dom';

import GameView from './game_view';
import Header from './header';
import Controls from './controls/controls';

import {getData} from './data';

const games = [
    {
        name: 'Sumo',
        file: 'examples/katamari/sumo.json'
    }, {
        name: 'Sweets',
        file: 'examples/katamari/sweets.json'
    }, {
        name: 'Origami',
        file: 'examples/katamari/origami.json'
    }, {
        name: '1000m',
        file: 'examples/katamari/1000m.json'
    }, {
        name: '2500m',
        file: 'examples/katamari/2500m.json'
    }, {
        name: '3000m',
        file: 'examples/katamari/3000m.json'
    }
];

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameFile: games[0].file,
            game: null,
            progress: 0
        };
    }

    componentWillMount() {
        if (!this.state.game)
            this.onGameChange(this.state.gameFile);
    }

    onPositionChange(progress) {
        this.setState({ progress });
    }

    onGameChange(gameFile) {
        getData(gameFile)
            .then(game => {
                this.setState({ game, progress: 0 });
            })
            .catch(e => console.error(e));
    }

    render() {
        return (
            <div className="main container">
                <Header />
                <GameView game={this.state.game} progress={this.state.progress} gameFile={this.state.gameFile} />
                <Controls
                    games={games}
                    duration={this.state.game ? this.state.game.duration : 0}
                    progress={this.state.progress}
                    onPositionChange={this.onPositionChange.bind(this) }
                    onGameChange={this.onGameChange.bind(this) }/>
            </div>);
    }
};


ReactDOM.render(
    <Main />,
    document.getElementById('content'));