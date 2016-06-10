import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Page header.
 */
export default class Header extends React.Component {
    render() {
        return (
            <header className="page-header">
                <div className="title">
                    <img className="logo" src="images/logo.svg"/>
                    <div className="description">
                        <span className="blurb">Visualizing Katamari Damacy gameplay input.</span>
                        <nav>
                            <a href="https://github.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/">source</a>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
};

