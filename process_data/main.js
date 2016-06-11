/**
 * Simple script for converting raw text data to json
 */
"use strict";
const fs = require('fs');
const process = require('process');
const processRow = require('../src/process/row');
const moment = require('moment');
const input = require('../src/process/input');

/**
 * Load some raw data form a file.
 */
const loadData = path =>
    new Promise((resolve, reject) => {
        const content = fs.readFileSync(path, 'utf-8');
        return resolve(content);
    });

/**
 * Remove data at ends when no input is being entered.
 */
const trimEnds = data => {
    let start = 0;
    let end = data.length - 1;
    while (start < end && input.isDead(data[start]))
        ++start;

    while (end > start && input.isDead(data[end]))
        --end;

    return data.slice(start, end);
};

/**
*/
const processData = text =>
    text.split('\n').filter(x => x.indexOf(',') > 0).map(processRow);

/**
 * Load data from a text file
 */
const getData = path =>
    loadData(path)
        .then(x => processData(x))
        .then(trimEnds)
        .then(createMatch);

const createMatch = data => {
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


const in_file = process.argv[2];
const out_file = process.argv[3];

getData(in_file)
    .then(data => {
        fs.writeFileSync(out_file, JSON.stringify(data, null, 2), '')
    })
    .catch(e => console.error(e));
