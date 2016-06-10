import React from 'react';
import  ReactDOM from 'react-dom';
import moment from 'moment';


const clamp = (min, max, x) =>
    Math.max(min, Math.min(max, x));

/**
 * Indicator of current position on timeline.
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
        context.strokeStyle = '#444';
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
 * Interactive timeline for game session.
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
        const progress = clamp(0, 1.0, (event.pageX - rect.left) / rect.width);
        return progress
    }

    timeToString(ms) {
        return moment(moment.duration(ms)._data).format('mm:ss.SSS');
    }

    render() {
        const end = this.timeToString(this.props.duration);
        const middle = this.timeToString(this.props.duration * this.props.progress);

        return (
            <div id="timeline" onMouseDown={this.onMouseDown.bind(this) } onMouseUp={this.onMouseUp.bind(this) } onMouseMove={this.onMouseMove.bind(this) }>
                <div className='timeline-content'>
                    <div className='timeline-body'>
                        <TimelineTicks duration={this.props.duration} />
                        <TimelineScrubber progress={this.props.progress} />
                    </div>
                    <div className="timeline-label" style={{ left: 0 }}>{this.timeToString(0) }</div>
                    <div className="timeline-label" style={{ left: '50%' }}>{middle}</div>
                    <div className="timeline-label" style={{ right: 0 }}>{end}</div>
                </div>
            </div>);
    }
};

