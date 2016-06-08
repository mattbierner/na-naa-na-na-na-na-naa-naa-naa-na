"use strict";
import THREE from 'three';
import OrbitControls from './OrbitControls';
import Shader from './stream_shader';
const ResizeSensor = require('imports?this=>window!css-element-queries/src/ResizeSensor');

import Base3dView from './base_3d_view';

const SCALE = 1 / 50;
const BUFFER_SIZE = 300;
const RADIUS = 1;
const ROTATION_SCALE = 0.03;

const shaderMaterial = new THREE.ShaderMaterial(Shader);

const isDead = (x, y) =>
    x === 0 && y === 0;

/**
 * 3D view that accepts streaming data
 */
export default class Viewer extends Base3dView {
    constructor(canvas, container) {
        super(canvas, container);

        this._initGeometry();
        this._initPointer();
        this._quaternion = new THREE.Quaternion(0, 0, 0, 1);
        this._i = 0;
        this._start = new THREE.Vector3(0, 0, RADIUS);
        this._angle = 0;
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

    _initPointer() {
        const geometry = new THREE.CylinderGeometry(0, 0.05, 0.05 * 2, 4);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        this._pointer = new THREE.Mesh(geometry, material);
        this._scene.add(this._pointer);
    }

    /**
     * 
     */
    draw(data, leftXKey, leftYKey, rightXKey, rightYKey) {
        const leftX = data[leftXKey];
        const leftY = data[leftYKey];
        const leftAngle = Math.atan2(leftY, leftX);

        const rightX = data[rightXKey];
        const rightY = data[rightYKey];
        const rightAngle = Math.atan2(rightY, rightX);

        //
        let translate = true;
        if (isDead(leftX, leftY) && !isDead(rightX, rightY)) {
            // right stick only rotation
            this._rotate(rightY * 1);
            translate = false;
        } else if (!isDead(leftX, leftY) && isDead(rightX, rightY)) {
            // left stick only rotation
            this._rotate(leftY * -1);
            translate = false;
        } else if (leftY > 0 && rightY < 0) {
            // down left, up right rotation
            this._rotate(leftY - rightY);
            translate = false;
        } else if (rightY > 0 && leftY < 0) {
            // down left, up right rotation
            this._rotate(rightY - leftY);
            translate = false;
        }

        const direction = new THREE.Vector3(Math.sin(this._angle), Math.cos(this._angle), 0);
        if (translate) {
            this._translate(leftX + rightX, leftY + rightY);
        }

        ///
        const vector = new THREE.Vector3(0, 0, RADIUS);
        vector.applyQuaternion(this._quaternion);
        this._quaternion.normalize();

        this._start.toArray(this._position.array, this._i * 3 * 2);
        vector.toArray(this._position.array, this._i * 3 * 2 + 3);
        this._start = vector;
        this._progress.array[this._i * 2] = 1;
        this._progress.array[this._i * 2 + 1] = 1;

        // update pointer
        this._pointer.position.copy(vector);

        const temp = new THREE.Matrix4()
        temp.lookAt(direction, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1));

        this._pointer.quaternion.copy(
            this._quaternion.clone().multiply(new THREE.Quaternion().setFromRotationMatrix(temp))
                .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)));

        ++this._i;
        this._i %= BUFFER_SIZE;

        this._position.needsUpdate = true;
        this._progress.needsUpdate = true;
    }

    _rotate(amount) {
        this._angle += amount * ROTATION_SCALE;
    }

    _translate(x, y) {
        const direction = new THREE.Vector3(Math.sin(this._angle), Math.cos(this._angle), 0);
        const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0);

        const horizontal = new THREE.Quaternion().setFromAxisAngle(direction, x * SCALE);
        const vertical = new THREE.Quaternion().setFromAxisAngle(perpendicular, y * SCALE);
        this._quaternion.multiply(horizontal).multiply(vertical);
    }
}