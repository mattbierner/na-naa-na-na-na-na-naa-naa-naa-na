import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Main page header.
 */
export default class Header extends React.Component {
    render() {
        return (
            <header className="page-header">
                <div className="title">
                    <img className="logo" src="images/logo.svg"/>
                    <div className="description">
                        <span className="blurb">Visualizing Katamari Damacy Gameplay Input</span>
                        <nav className="links">
                            <a href="https://github.com/mattbierner/na-naa-na-na-na-na-naa-naa-naa-na/blob/gh-pages/documentation/about.md">Help</a>
                            <a href="https://github.com/mattbierner/na-naa-na-na-na-na-naa-naa-naa-na/">Source</a>
                            <a href="https://github.com/mattbierner/na-naa-na-na-na-na-naa-naa-naa-na/">Post</a>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
};

