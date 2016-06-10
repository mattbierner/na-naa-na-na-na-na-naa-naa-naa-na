"use strict";
import THREE from 'three';
import OrbitControls from './OrbitControls';
import Shader from './shader';
const ResizeSensor = require('imports?this=>window!css-element-queries/src/ResizeSensor');

import Base3dView from './base_3d_view';

const SCALE = 1 / 50;
const ROTATION_SCALE = 0.03;

const shaderMaterial = new THREE.ShaderMaterial(Shader);

const isDead = (x, y) =>
    x === 0 && y === 0;

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
     * 
     */
    draw(data, leftXKey, leftYKey, rightXKey, rightYKey, startColor, endColor) {
        this.reset();

        const compSize = 3;
        
        const buffergeometry = new THREE.BufferGeometry();

        const position = new THREE.Float32Attribute(data.length * 3 * compSize, 3);
        buffergeometry.addAttribute('position', position);

        const opacity = new THREE.Float32Attribute(data.length * compSize, 1);
        buffergeometry.addAttribute('opacity', opacity);

        const progress = new THREE.Float32Attribute(data.length * compSize, 1);
        buffergeometry.addAttribute('progress', progress);

        const rMin = 0.01;
        const rMax = 1;
        const rD = rMax - rMin;

        let angle = 0;
        let quaternion = new THREE.Quaternion(0, 0, 0, 1);
        let i = 0;
        this._progress = [];
        const center = new THREE.Vector3(0, 0, 0);
        let previous = center.clone();
        for (const e of data) {
            const leftX = e[leftXKey];
            const leftY = e[leftYKey];

            const rightX = e[rightXKey];
            const rightY = e[rightYKey];

            const r = rMin + rD * e.progress;

            // Update positon based on controls
            if (isDead(leftX, leftY) && !isDead(rightX, rightY)) {
                // right stick only rotation
                angle += rightY * ROTATION_SCALE;
            } else if (!isDead(leftX, leftY) && isDead(rightX, rightY)) {
                // left stick only rotation
                angle += -leftY * ROTATION_SCALE;
            } else if (leftY > 0 && rightY < 0) {
                // down left, up right rotation
                angle += (leftY - rightY) * ROTATION_SCALE;
            } else if (rightY > 0 && leftY < 0) {
                // down left, up right rotation
                angle += (rightY - leftY) * ROTATION_SCALE;
            } else {
                // must be a translation
                const x = leftX + rightX;
                const y = leftY + rightY;
                if (x !== 0 && y !== 0) {
                    const direction = new THREE.Vector3(Math.sin(angle), Math.cos(angle), 0);
                    const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0);

                    const horizontal = new THREE.Quaternion().setFromAxisAngle(direction, x * SCALE);
                    const vertical = new THREE.Quaternion().setFromAxisAngle(perpendicular, y * SCALE);
                    quaternion = quaternion.multiply(horizontal).multiply(vertical);
                }
            }

            const vector = new THREE.Vector3(0, 0, r);
            vector.applyQuaternion(quaternion);
            quaternion.normalize();

            center.toArray(position.array, i * 3 * compSize);
            previous.toArray(position.array, i * 3 * compSize + 3);
            vector.toArray(position.array, i * 3 * compSize + 6);
            previous = vector;

            opacity.array[i * compSize] = 0;
            opacity.array[i * compSize + 1] = 0.2;
            opacity.array[i * compSize + 2] = 0.2;

            progress.array[i * compSize] = progress.array[i * compSize + 1] = progress.array[i * compSize + 2] = e.progress;
            this._progress.push(e.progress);
            ++i;
        }

        shaderMaterial.uniforms.startColor.value = startColor;
        shaderMaterial.uniforms.endColor.value = endColor;

        const line = new THREE.Mesh(buffergeometry, shaderMaterial);
        this._scene.add(line);
        this._line = line;
    }

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