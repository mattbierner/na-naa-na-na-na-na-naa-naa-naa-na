"use strict";
import THREE from 'three';
import OrbitControls from './OrbitControls';
import Shader from './shader';
const ResizeSensor = require('imports?this=>window!css-element-queries/src/ResizeSensor');

import Base3dView from './base_3d_view';

const SCALE = 1 / 20;

const shaderMaterial = new THREE.ShaderMaterial(Shader);

const surfaceArea = r =>
    4 / 3 * Math.PI * r * r;

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
    draw(data, xKey, yKey, startColor, endColor) {
        const buffergeometry = new THREE.BufferGeometry();

        const position = new THREE.Float32Attribute(data.length * 3, 3);
        buffergeometry.addAttribute('position', position)

        const progress = new THREE.Float32Attribute(data.length, 1);
        buffergeometry.addAttribute('progress', progress);

        const rMin = 0.01;
        const rMax = 1;
        const rD = rMax - rMin;
        const angle = 0;
        
        let quaternion = new THREE.Quaternion(0, 0, 0, 1);
        let i = 0;
        for (const e of data) {
            const x = e[xKey];
            const y = e[yKey];
            const r = rMax//rMin + rD * e.progress;
            const scale = SCALE;// * (surfaceArea(rMax) / surfaceArea(r)) * .1;
            
            const horizontal = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), x * scale);
            const vertical = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), y * scale);
            quaternion.multiply(horizontal).multiply(vertical);

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
            material.uniforms.time.value += 0.01;
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