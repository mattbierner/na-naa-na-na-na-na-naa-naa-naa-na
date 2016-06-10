"use strict";
import THREE from 'three';
const ResizeSensor = require('imports?this=>window!css-element-queries/src/ResizeSensor');

import OrbitControls from './OrbitControls';
import Shader from './shaders/default_solid';

import Base3dView from './base_3d_view';
import katamariMovementForControls from './katamari_input';

const SCALE = 1 / 50;
const rMin = 0.01;
const rMax = 1;
const rD = rMax - rMin;

const shaderMaterial = new THREE.ShaderMaterial(Shader);

const closest = (items, value) => {
    let startIndex = 0;
    let stopIndex = items.length - 1;
    let middle = Math.floor((stopIndex + startIndex) / 2);

    while (items[middle] != value && startIndex < stopIndex) {
        //adjust search area
        if (value < items[middle]) {
            stopIndex = middle - 1;
        } else if (value > items[middle]) {
            startIndex = middle + 1;
        }

        //recalculate middle
        middle = Math.floor((stopIndex + startIndex) / 2);
    }
    return middle;
};

/**
 * 3D view
 */
export default class Viewer extends Base3dView {
    constructor(canvas, container) {
        super(canvas, container);

        this._initPointer();
    }

    _initPointer() {
        const geometry = new THREE.SphereGeometry(0.01, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x87BF26 });
        this._pointer = new THREE.Mesh(geometry, material);
        this._scene.add(this._pointer);
    }

    /**
     * Set progress colors.
     */
    setColors(startColor, endColor) {
        shaderMaterial.uniforms.startColor.value = startColor;
        shaderMaterial.uniforms.endColor.value = endColor;
    }

    /**
     * 
     */
    draw(data) {
        this.reset();

        const compSize = 3;

        const buffergeometry = new THREE.BufferGeometry();

        const position = new THREE.Float32Attribute(data.length * 3 * 3, 3);
        buffergeometry.addAttribute('position', position);

        const opacity = new THREE.Float32Attribute(data.length * 3, 1);
        buffergeometry.addAttribute('opacity', opacity);

        const progress = new THREE.Float32Attribute(data.length * 3, 1);
        buffergeometry.addAttribute('progress', progress);

        this._progress = [];

        let angle = 0;
        let quaternion = new THREE.Quaternion(0, 0, 0, 1);
        let i = 0;
        const center = new THREE.Vector3(0, 0, 0);
        let previous = center.clone();

        for (const e of data) {
            const movement = katamariMovementForControls(quaternion, angle, e);
            angle = movement.angle;
            quaternion = movement.quaternion;

            const r = rMin + rD * e.progress;
            const vector = new THREE.Vector3(0, 0, r);
            vector.applyQuaternion(quaternion);
            quaternion.normalize();

            center.toArray(position.array, i * 3);
            previous.toArray(position.array, i * 3 + 3);
            vector.toArray(position.array, i * 3 + 6);
            previous = vector;

            opacity.array[i] = 0;
            opacity.array[i + 1] = 0.2;
            opacity.array[i + 2] = 0.2;

            progress.array[i] = progress.array[i + 1] = progress.array[i + 2] = e.progress;
            this._progress.push(e.progress);
            i += 3;
        }

        const line = new THREE.Mesh(buffergeometry, shaderMaterial);
        this._scene.add(line);
        this._line = line;
    }

    /**
     * Set the progress in the current match.
     */
    setProgress(progress) {
        shaderMaterial.uniforms.time.value = progress;
        shaderMaterial.uniforms.needsUpdate = true;

        if (!this._line)
            return;

        const attr = this._line.geometry.attributes;
        let index = closest(this._progress, progress) * 3 * 3;

        let pos = new THREE.Vector3(attr.position.array[index + 3], attr.position.array[index + 3 + 1], attr.position.array[index + 3 + 2]);

        this._pointer.position.copy(pos);
    }

    /**
     * Clear all current elements from the scene.
     */
    reset() {
        this._scene.remove(this._line);
        this._line = null;
        this.setProgress(0);
    }
}