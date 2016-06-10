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
                    </div>
                </div>
            </header>
        );
    }
};

