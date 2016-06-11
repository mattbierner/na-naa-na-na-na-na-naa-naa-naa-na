import React from 'react';
import ReactDOM from 'react-dom';

import GameView from './game_view';
import Header from './header';
import MainOptionsPanel from './main_options_panel';
import Controls from './controls/controls';

import {getData} from './data';
import * as options from './options';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            game: null,
                
            // options
            gameFile: options.games[0].file,
            edging: 5,
            opacity: 30,
            innerRadius: 1,
            startColor: '#ff00ff',
            endColor: '#00ffff'
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

    onEdgingChange(value) {
        this.setState({ edging: value });
    }

    onOpacityChange(value) {
        this.setState({ opacity: value });
    }

    onInnerRadiusChange(value) {
        this.setState({ innerRadius: value });
    }

    onStartColorChange(value) {
        this.setState({ startColor: value });
    }

    onEndColorChange(value) {
        this.setState({ endColor: value });
    }

    render() {
        return (
            <div className="main container">
                <Header />
                <MainOptionsPanel {...this.state}
                    onEdgingChange={this.onEdgingChange.bind(this)}
                    onOpacityChange={this.onOpacityChange.bind(this)}
                    onInnerRadiusChange={this.onInnerRadiusChange.bind(this)}
                    onStartColorChange={this.onStartColorChange.bind(this)}
                    onEndColorChange={this.onEndColorChange.bind(this)}/>
                
                <div className="main-view">
                    <GameView {...this.state} />
                    <Controls
                        games={options.games}
                        game={this.state.game}
                        duration={this.state.game ? this.state.game.duration : 0}
                        progress={this.state.progress}
                        onPositionChange={this.onPositionChange.bind(this) }
                        onGameChange={this.onGameChange.bind(this) }/>
                </div>
            </div>);
    }
};


ReactDOM.render(
    <Main />,
    document.getElementById('content'));