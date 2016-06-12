import THREE from 'three';
import {quaternionToVector} from './_common';

/**
 * Basic solid shader.
 */
export default {
    uniforms: {
        startColor: { type: "v4", value: new THREE.Vector4(0, 0, 0, 1) },
        endColor: { type: "v4", value: new THREE.Vector4(0.9, 0.9, 0.9, 1) },
        time: { value: 0.0 },

        minRadius: { value: 0.05 },
        maxRadius: { value: 1.0 },
        edging: { value: 0.05 },
        totalOpacity: { value: 1.0 }
    },
    vertexShader: `
        uniform vec4 startColor;
        uniform vec4 endColor;
        uniform float time;
        uniform float minRadius;
        uniform float maxRadius;
        uniform float edging;
        uniform float totalOpacity;

        attribute vec4 spherePosition;

        attribute float progress;
        attribute float opacity;
        attribute float innerScaling;

        varying vec4 vColor;

        ${quaternionToVector}

        void main() {
            float alpha = float(progress < time) * opacity * totalOpacity;
            vColor = mix(startColor, endColor, progress) * vec4(1, 1, 1, alpha);
            
            // Compute position on sphere
            float r = minRadius + (maxRadius - minRadius) * progress;
            vec3 rad = vec3(0, 0, r);
            vec3 posOnSphere = rotate_vector(spherePosition, rad);

            vec3 pos = posOnSphere - ((innerScaling * edging) * posOnSphere);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        varying vec4 vColor;
        
        void main() {
            gl_FragColor = vColor;
        }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: true,
    depthWrite: true
};