"use strict";
import THREE from 'three';
const ResizeSensor = require('imports?this=>window!css-element-queries/src/ResizeSensor');

import OrbitControls from './OrbitControls';
import Shader from './shaders/default_solid';
import PointerShader from './shaders/pointer';

import Base3dView from './base_3d_view';
import katamariMovementForControls from './katamari_input';

const shaderMaterial = new THREE.ShaderMaterial(Shader);
const pointerShader = new THREE.ShaderMaterial(PointerShader);
pointerShader.uniforms.objColor.value = new THREE.Vector4(0x87, 0xbf, 0x26, 1);

pointerShader.uniforms.time = shaderMaterial.uniforms.time;
pointerShader.uniforms.minRadius = shaderMaterial.uniforms.minRadius;
pointerShader.uniforms.maxRadius = shaderMaterial.uniforms.maxRadius;


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
        this._pointer = new THREE.Mesh(geometry, pointerShader);
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

        const buffergeometry = new THREE.BufferGeometry();

        const position = new THREE.Float32Attribute(data.length * 3 * 2, 3);
        buffergeometry.addAttribute('position', position);

        const spherePosition = new THREE.Float32Attribute(data.length * 4 * 2, 4);
        buffergeometry.addAttribute('spherePosition', spherePosition);

        const opacity = new THREE.Float32Attribute(data.length * 2, 1);
        buffergeometry.addAttribute('opacity', opacity);

        const innerScaling = new THREE.Float32Attribute(data.length * 2, 1);
        buffergeometry.addAttribute('innerScaling', innerScaling);

        const progress = new THREE.Float32Attribute(data.length * 2, 1);
        buffergeometry.addAttribute('progress', progress);

        this._progress = [];

        let angle = 0;
        let quaternion = new THREE.Quaternion(0, 0, 0, 1);
        let i = 0;

        for (const e of data) {
            const movement = katamariMovementForControls(quaternion, angle, e);
            angle = movement.angle;
            quaternion = movement.quaternion;

            quaternion.toArray(spherePosition.array, i * 4 + 0); // inner
            quaternion.toArray(spherePosition.array, i * 4 + 4); // outer
            quaternion.normalize();

            opacity.array[i] = 0;
            opacity.array[i + 1] = 1;

            innerScaling.array[i] = 1;
            innerScaling.array[i + 1] = 0;

            progress.array[i] = progress.array[i + 1] = e.progress;
            this._progress.push(e.progress);
            i += 2;
        }


        const mesh = new THREE.Mesh(buffergeometry, shaderMaterial);
        mesh.drawMode = THREE.TriangleStripDrawMode;

        this._scene.add(mesh);
        this._line = mesh;
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
        let index = closest(this._progress, progress) * 4 * 2;

        let quaternion = new THREE.Vector4(
            attr.spherePosition.array[index], 
            attr.spherePosition.array[index + 1],
            attr.spherePosition.array[index + 2],
            attr.spherePosition.array[index + 3]);

        pointerShader.uniforms.spherePosition.value = quaternion;
        pointerShader.uniforms.spherePosition.needsUpdate = true;
    }

    /**
     * Update edge thickness
     */
    setEdging(value) {
        shaderMaterial.uniforms.edging.value = value / 100;
        shaderMaterial.uniforms.edging.needsUpdate = true;
    }

    /**
     * Update opacity of shape
     */
    setOpacity(value) {
        shaderMaterial.uniforms.totalOpacity.value = value / 100;
        shaderMaterial.uniforms.totalOpacity.needsUpdate = true;
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