"use strict";

import Viewer from './3d_view';

import {getData} from './data';
import * as analog from './analog';

const MID = 128;
const MAX = 255;
const DEAD_ZONE = 10;
const SCALE = 1 / 30;

const drawData = data => {
    const viewer = new Viewer(
        document.getElementById('main_canvas'),
        document.getElementById('main_container'));
    
    viewer.draw(0x0000ff, analog.normalize(data.map(x => ({
        x: x.left_x,
        y: x.left_y
    }))));
    /*
    viewer.draw(0xff0000, analog.normalize(data.map(x => ({
        x: x.right_x,
        y: x.right_y
    }))));*/
};


getData('examples/katamari/sumo.data')
    .then(drawData)
    .catch(e => console.error(e));
    
