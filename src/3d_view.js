"use strict";
import THREE from 'three';
import OrbitControls from './OrbitControls';
import Shader from './shader';
const ResizeSensor = require('imports?this=>window!css-element-queries/src/ResizeSensor');

import Base3dView from './base_3d_view';

const SCALE = 1 / 50;
const ROTATION_SCALE = 0.03;

const shaderMaterial = new THREE.ShaderMaterial(Shader);

const surfaceArea = r =>
    4 / 3 * Math.PI * r * r;


const isDead = (x, y) =>
    x === 0 && y === 0;

/**
 * 3D view
 */
export default class Viewer extends Base3dView {
    constructor(canvas, container) {
        super(canvas, container);
    }

    /**
     * 
     */
    draw(data, leftXKey, leftYKey, rightXKey, rightYKey, startColor, endColor) {
        const buffergeometry = new THREE.BufferGeometry();

        const position = new THREE.Float32Attribute(data.length * 3, 3);
        buffergeometry.addAttribute('position', position)

        const progress = new THREE.Float32Attribute(data.length, 1);
        buffergeometry.addAttribute('progress', progress);

        const rMin = 0.01;
        const rMax = 1;
        const rD = rMax - rMin;

        let angle = 0;
        let quaternion = new THREE.Quaternion(0, 0, 0, 1);
        let i = 0;
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

            vector.toArray(position.array, i * 3);
            progress.array[i] = e.progress;
            ++i;
        }

        const material = shaderMaterial.clone();
        material.uniforms.startColor.value = startColor;
        material.uniforms.endColor.value = endColor;

        this._toUpdate.push(e => {
            material.uniforms.time.value += 0.001;
            material.uniforms.needsUpdate = true;
        });

        const line = new THREE.Line(buffergeometry, material);
        this._scene.add(line);
    }

    /**
     * Clear all current elements from the scene.
     */
    clear() {
        super.clear()
        // TODO
    }
}