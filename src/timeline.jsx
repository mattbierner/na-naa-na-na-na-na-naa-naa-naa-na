"use strict";

const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');

import * as num from '../num';

import {getWeaponsTable} from '../data/weapons';

const tryInvoke = (f, x) =>
    f ? f(x) : null;

const getWeaponName = weaponId => {
    const weapon = getWeaponsTable().get(weaponId);
    return weapon ? weapon.name : 'unknown';
};

/**
 * Single event on the timeline.
 */
class TimelineEvent extends React.Component {
    onMouseEnter(event) {
        tryInvoke(this.props.onFocus, this.props.event);
    }

    onMouseLeave(event) {
        tryInvoke(this.props.onFocusEnd, this.props.event);
    }

    render() {
        const progress = this.props.event ? this.props.event.MatchProgress : 0;
        const style = {
            left: `${progress * 100}%`
        };
        const weaponName = this.props.event ? getWeaponName(this.props.event.KillerWeaponStockId) : 'unknown';

        return (
            <li className={`timeline-event weapon weapon-${weaponName}`}
                style={style}
                onMouseEnter={this.onMouseEnter.bind(this) }
                onMouseLeave={this.onMouseLeave.bind(this) } />);
    }
}

/**
 * Set of timeline events
 */
class TimelineEvents extends React.Component {
    render() {
        const events = [];
        if (this.props.stream) {
            this.props.stream.forEach(event => {
                events.push(<TimelineEvent key={event.Id} event={event} {...this.props} />);
            });
        }
        return <ul className="timeline-events">{events}</ul>;
    }
}

/**
 * 
 */
class TimelineScrubber extends React.Component {
    render() {
        return (
            <div className="scrubber"
                style={{ position: 'absolute', top: 0, left: (this.props.progress || 0) * 100 + '%' }} />);
    }
}

/**
 * 
 */
class TimelineTicks extends React.Component {
    componentDidMount() {
        this.drawGrid();

        window.addEventListener('resize', () => {
            this.drawGrid(this.props.duration);
        }, false);
    }

    componentWillReceiveProps(nextProps) {
        this.drawGrid(nextProps.duration);
    }

    drawGrid(duration) {
        if (!+duration)
            return;
        const canvas = ReactDOM.findDOMNode(this);
        const {width, height} = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        context.lineWidth = 1;
        context.strokeStyle = 'white';
        this.drawTicks(context, width, height, duration, height, 30000.0);
        this.drawTicks(context, width, height, duration, height / 4, 5000.0);
    }

    drawTicks(context, width, height, duration, tickHeight, size) {
        const upper = height / 2 - tickHeight / 2;
        const lower = height / 2 + tickHeight / 2;

        context.beginPath();
        const stepSize = width / (duration / size);
        for (let i = 0; i < width; i += stepSize) {
            context.moveTo(i, upper);
            context.lineTo(i, lower);
        }
        context.stroke();
    }

    render() {
        return <canvas className="timeline-ticks" />;
    }
}

/**
 * 
 */
export default class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false
        };
    }

    onEventFocus(event) {
        this.setState({ focusedEvent: event });
        tryInvoke(this.props.onEventFocus, event);
    }

    onEventFocusEnd(event) {
        this.setState({ focusedEvent: null });
        tryInvoke(this.props.onEventFocusEnd, event);
    }

    onMouseDown(event) {
        if (this.state.dragging)
            return;
        this.setState({ dragging: true })
        const progress = this.getProgressFromMouseEvent(event);
        this.props.onDrag(progress);
    }

    onMouseUp(event) {
        if (!this.state.dragging)
            return;
        this.setState({ dragging: false });
        const progress = this.getProgressFromMouseEvent(event);
        this.props.onDragDone(progress);
    }

    onMouseMove(e) {
        if (!this.state.dragging)
            return;
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        
        const progress = this.getProgressFromMouseEvent(e);
        this.props.onDrag(progress);
    }

    getProgressFromMouseEvent(event) {
        const node = ReactDOM.findDOMNode(this).getElementsByClassName('timeline-content')[0];
        const rect = node.getBoundingClientRect();
        const progress = num.clamp(0, 1.0, (event.pageX - rect.left) / rect.width);
        return progress
    }

    timeToString(ms) {
        return moment(moment.duration(ms)._data).format('mm:ss.SSS');
    }

    render() {
        const end = this.props.stream && this.timeToString(this.props.stream.duration);
        const middle = this.props.stream && this.timeToString(this.props.stream.duration * this.props.progress);

        return (
            <div id="timeline" onMouseDown={this.onMouseDown.bind(this) } onMouseUp={this.onMouseUp.bind(this) } onMouseMove={this.onMouseMove.bind(this) }>
                <div className='timeline-content'>
                    <TimelineTicks duration={this.props.stream && this.props.stream.duration} />
                    <TimelineEvents stream={this.props.stream} />
                    <TimelineScrubber progress={this.props.progress} />
                </div>
                <div className="timeline-label" style={{ left: 0 }}>{this.timeToString(0) }</div>
                <div className="timeline-label" style={{ left: '50%' }}>{middle}</div>
                <div className="timeline-label" style={{ right: 0 }}>{end}</div>
            </div>);
    }
};

