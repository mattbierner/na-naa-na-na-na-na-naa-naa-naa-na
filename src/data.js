"use strict";

import moment from 'moment';
import Viewer from './3d_view.js';

const MID = 128;
const MAX = 255;
const DEAD_ZONE = 10;
const SCALE = 1 / 30;

const loadData = path =>
    new Promise((resolve, reject) => {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', path);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200)
                return resolve(xmlhttp.responseText);
        };

        xmlhttp.send();
    });

const processData = text =>
    text.split('\n').filter(x => x.indexOf(',') > 0).map(row => {
        const elements = row.split(',').map(x => x.trim());
        const time = moment(elements[0]);
        return {
            time,
            right_x: +elements[3],
            right_y: +elements[4],
            left_x: +elements[5],
            left_y: +elements[6]
        };
    });

export const getData = path =>
    loadData(path).then(x => processData(x));
