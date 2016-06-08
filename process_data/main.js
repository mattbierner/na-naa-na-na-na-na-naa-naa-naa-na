/**
 * Simple script for converting raw text data to json
 */
"use strict";
const proces_data = require('proces_data');
const fs = require('fs');
const process = require('process');

/**
 * Load some raw data form a file.
 */
const loadData = path =>
    new Promise((resolve, reject) => {
        const content = fs.readFileSync(path, 'utf-8');
        return resolve(content);
    });

/**
 * Load data from a text file
 */
const getData = path =>
    loadData(path)
        .then(x => processData(x))
        .then(trimEnds)
        .then(createMatch);


const in_file = process.argv[2];
const out_file = process.argv[3];

proces_data.getData(in_file)
    .then(data => {
        fs.writeFileSync(out_file, JSON.stringify(data, null, 2), '')
    })
    .catch(e => console.error(e));
