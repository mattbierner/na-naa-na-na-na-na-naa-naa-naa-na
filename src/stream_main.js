import React from 'react';
import ReactDOM from 'react-dom';

import GameView from './stream_game_view';
import Header from './header';

/**
 * Main view for a streaming input sessions.
 */
class StreamMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="main container">
                <Header />
                <div className="main-view">
                    <GameView {...this.state} />
                </div>
            </div>);
    }
};


ReactDOM.render(
    <StreamMain />,
    document.getElementById('content'));