/**
 * Simple script for converting raw text data to json
 */
"use strict";
const moment = require('moment');
const analog = require('./analog');

const MID = 128;
const MAX = 255;
const DEAD_ZONE = 40;


/**
*/
const extractRow = row => {
    const elements = row.split(',').map(x => x.trim());
    const time = moment(elements[0]);
    return {
        time,
        right_x: +elements[3],
        right_y: +elements[4],
        left_x: +elements[5],
        left_y: +elements[6]
    };
};

const processRow = module.exports.processRow = data => {
    const e = extractRow(data);
    const left = analog.normalize(e.left_x, e.left_y);
    e.left_x = left.x;
    e.left_y = left.y;
    
    const right = analog.normalize(e.right_x, e.right_y);
    e.right_x = right.x;
    e.right_y = right.y;
    return e;
};

/**
*/
const processData = text =>
    text.split('\n').filter(x => x.indexOf(',') > 0).map(processRow);

/**
 * Check if single analog input is in the dead zone.
 */
const isDeadInput = value =>
    Math.abs(value - MID) < DEAD_ZONE;

/**
 * Check if all analog inputs are in dead zones.
 */
const isDead = x =>
    isDeadInput(x.right_x) && isDeadInput(x.right_y) && isDeadInput(x.left_x) && isDeadInput(x.left_y);

/**
 * Remove data at ends when no input is being entered.
 */
const trimEnds = data => {
    let start = 0;
    let end = data.length - 1;
    while (start < end && isDead(data[start]))
        ++start;

    while (end > start && isDead(data[end]))
        --end;

    return data.slice(start, end);
};

/**
 * Create match data structure from raw event data.
 */
module.exports.createMatch = data => {
    const start = data[0] && data[0].time;
    const duration = data.length < 2 ? 0 : data[data.length - 1].time.diff(start);
    
    for (const e of data) {
        const time = e.time.diff(start);
        e.time = time;
        e.progress = time / duration;
    }

    return {
        duration: duration,
        events: data
    };
};
