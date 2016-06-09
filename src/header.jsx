import React from 'react';
import ReactDOM from 'react-dom';

import GameView from './game_view';

export default class Header extends React.Component {
    render() {
        const rainbow = ['#fc0000','#ff7f00','#fefd00','#02fd00','#0000fd','#8000fc','#fd00fe'].map((x, i) =>
            <div style={{background: x, animationDelay: Math.random() + 's', width: (100 - 3 * i) + '%'}} key={i}/>);
        
        return (
            <header className="page-header">
                <div className="title">
                    <img className="logo" src="images/logo.svg"/>
                    <div className="description">
                        <span className="blurb">Visualizing Katamari Damacy gameplay input.</span>
                        <div className="rainbow">{rainbow}</div>

                    </div>
                </div>

            </header>);
    }
};

