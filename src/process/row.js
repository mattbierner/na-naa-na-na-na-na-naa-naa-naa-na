/**
 * Simple script for converting raw text data to json
 */
"use strict";
const moment = require('moment');
const input = require('./input');

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

module.exports = data => {
    const e = extractRow(data);
    const left = input.normalize(e.left_x, e.left_y);
    e.left_x = left.x;
    e.left_y = left.y;
    
    const right = input.normalize(e.right_x, e.right_y);
    e.right_x = right.x;
    e.right_y = right.y;
    return e;
};