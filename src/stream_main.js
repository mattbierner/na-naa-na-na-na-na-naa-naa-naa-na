import React from 'react';
import ReactDOM from 'react-dom';

import GameView from './stream_game_view';
import Header from './header';

/**
 * Main view for a streaming input sessions.
 */
class StreamMain extends React.Component {
    render() {
        return (
            <div className="main container">
                <Header />
                <div className="main-view">
                    <GameView />
                </div>
            </div>);
    }
};


ReactDOM.render(
    <StreamMain />,
    document.getElementById('content'));