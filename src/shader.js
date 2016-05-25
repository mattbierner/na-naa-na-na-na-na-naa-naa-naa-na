import THREE from 'three';

export default {
    uniforms: {
        startColor: { type: "v4", value: new THREE.Vector4(0, 0, 0, 1) },
        endColor: { type: "v4", value: new THREE.Vector4(0.9, 0.9, 0.9, 1) },
        time: { value: 0.0 },
    },
    vertexShader: `
        uniform vec4 startColor;
        uniform vec4 endColor;
    
        attribute float progress;

        varying vec4 vColor;

        void main() {
            vColor = mix(startColor, endColor, progress);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec4 vColor;
        
        void main() {
            gl_FragColor = vColor;
        }
    `,
};