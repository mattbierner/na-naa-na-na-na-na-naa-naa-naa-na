import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Game file selector.proces
 */
export default class GameSelector extends React.Component {
    onChange(e) {
        this.props.onChange(e.target.value);
    }

    render() {
        const options = this.props.games.map(x =>
            <option value={x.file} key={x.file}>{x.name}</option>);

        return (
            <span className="selector-control">
                Game:
                <select style={{ zIndex: 999 }} className="game-selector" onChange={this.onChange.bind(this) } value={this.props.gameFile}>
                    {options}
                </select>
            </span>
        );
    }
}