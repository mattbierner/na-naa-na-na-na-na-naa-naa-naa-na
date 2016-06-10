import THREE from 'three';

import {quaternionToVector} from './_common';

/**
 * Basic solid shader.
 */
export default {
    uniforms: {
        time: { value: 0.0 },
        minRadius: { value: 0.0 },
        maxRadius: { value: 1.0 },
        objColor: {type: 'v4', value: new THREE.Vector4(0, 0, 0, 1) },
        spherePosition: {type: 'v4', value: new THREE.Vector4(0, 0, 0, 1) }
    },
    vertexShader: `
        uniform float time;
        uniform float minRadius;
        uniform float maxRadius;
        uniform vec4 spherePosition;
        uniform vec4 objColor;

        varying vec4 vColor;

        ${quaternionToVector}

        void main() {
            vColor = vec4(0, 1, 0, 1);
            
            // Compute position on sphere
            float r = minRadius + (maxRadius - minRadius) * time;
            vec3 rad = vec3(0, 0, r);
            vec3 posOnSphere = rotate_vector(spherePosition, rad);

            vec3 pos = posOnSphere + position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        varying vec4 vColor;
        
        void main() {
            gl_FragColor = vColor;
        }
    `
};