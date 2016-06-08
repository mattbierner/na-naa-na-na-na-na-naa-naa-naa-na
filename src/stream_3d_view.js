"use strict";
import THREE from 'three';
import OrbitControls from './OrbitControls';
import Shader from './stream_shader';
const ResizeSensor = require('imports?this=>window!css-element-queries/src/ResizeSensor');

import Base3dView from './base_3d_view';

const SCALE = 1 / 50;
const BUFFER_SIZE = 300;

const shaderMaterial = new THREE.ShaderMaterial(Shader);

/**
 * 3D view that accepts streaming data
 */
export default class Viewer extends Base3dView {
    constructor(canvas, container) {
        super(canvas, container);

        this._initGeometry();

        this._quaternion = new THREE.Quaternion(0, 0, 0, 1);
        this._i = 0;
        this._start = new THREE.Vector3(0, 0, 0);
    }

    _initGeometry() {
        this._buffergeometry = new THREE.BufferGeometry();

        this._position = new THREE.Float32Attribute(BUFFER_SIZE * 3 * 2, 3);
        this._buffergeometry.addAttribute('position', this._position)

        this._progress = new THREE.Float32Attribute(BUFFER_SIZE * 2, 1);
        this._buffergeometry.addAttribute('progress', this._progress);

        const material = shaderMaterial.clone();
        material.uniforms.startColor.value = new THREE.Vector4(0, 0, 0, 1);
        material.uniforms.endColor.value = new THREE.Vector4(0, 0, 0, 1);

        const line = new THREE.LineSegments(this._buffergeometry, material);
        this._scene.add(line);
    }

    /**
     * 
     */
    draw(data, xKey, yKey) {
        const x = data[xKey];
        const y = data[yKey];
        const r = 1;
        const scale = SCALE;
        console.log(x, y);
        const horizontal = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), x * scale);
        const vertical = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), y * scale);
        this._quaternion.multiply(horizontal).multiply(vertical);

        const vector = new THREE.Vector3(0, 0, r);
        vector.applyQuaternion(this._quaternion);
        this._quaternion.normalize();

        this._start.toArray(this._position.array, this._i * 3 * 2); 
        vector.toArray(this._position.array, this._i * 3 * 2 + 3);
        this._start = vector;
        this._progress.array[this._i * 2] = 1;
        this._progress.array[this._i * 2 + 1] = 1;

        ++this._i;
        this._i %= BUFFER_SIZE;

        this._position.needsUpdate = true;
        this._progress.needsUpdate = true;
    }

    /**
     * Clear all current elements from the scene.
     */
    clear() {
        super.clear()
        // TODO
    }
}