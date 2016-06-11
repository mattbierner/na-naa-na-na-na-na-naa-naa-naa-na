import React from 'react';
import ReactDOM from 'react-dom';

import GameView from './game_view';
import Header from './header';
import Controls from './controls/controls';
import OptionsPanel from './controls/options_panel';

import {getData} from './data';
import * as options from './options';

/**
 * Options panel.
 */
class MainOptionsPanel extends React.Component {
    render() {
        return (
            <OptionsPanel>
                s
            </OptionsPanel>
        );
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            game: null,
                
            // options
            gameFile: options.games[0].file,
        
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
                <MainOptionsPanel {...this.state} />
                <div className="main-view">
                    <GameView game={this.state.game} progress={this.state.progress} gameFile={this.state.gameFile} />
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