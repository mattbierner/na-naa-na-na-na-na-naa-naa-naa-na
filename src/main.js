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
                <input type="range" min="1" max="100" value={this.props.edging} onChange={this.props.onEdgingChange} />
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
            edging: 5
        
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

    onEdgingChange(e) {
        this.setState({ edging: e.target.value });
    }

    render() {
        return (
            <div className="main container">
                <Header />
                <MainOptionsPanel {...this.state}
                    onEdgingChange={this.onEdgingChange.bind(this)} />
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