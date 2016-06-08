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
        uniform float time;
        
        attribute float progress;

        varying vec4 vColor;

        void main() {
            float opacity = float(progress < time);
            
            vColor = vec4(0, 0, 0, 1);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec4 vColor;
        
        void main() {
            gl_FragColor = vColor;
        }
    `,
    transparent: true
};