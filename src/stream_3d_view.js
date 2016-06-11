import THREE from 'three';
import OrbitControls from './OrbitControls';
import Shader from './shaders/stream_shader';

import Base3dView from './base_3d_view';
import katamariMovementForControls from './katamari_input';

const BUFFER_SIZE = 300;
const RADIUS = 1;

const shaderMaterial = new THREE.ShaderMaterial(Shader);

/**
 * 3D view that accepts streaming data
 */
export default class Viewer extends Base3dView {
    constructor(canvas, container) {
        super(canvas, container);


        this._quaternion = new THREE.Quaternion(0, 0, 0, 1);
        this._i = 0;
        this._start = new THREE.Vector3(0, 0, RADIUS);
        this._angle = 0;

        this._initGeometry();
        this._initPointer();
        this._initGuide();
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

    _initGuide() {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true, opacity: 0.25 });
        this._scene.add(new THREE.Mesh(geometry, material));

        const material2 = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
        this._scene.add(new THREE.Mesh(geometry, material2));
    }

    /**
     * Add a single point to the drawn line
     */
    draw(data) {
        console.log(data);
        const movement = katamariMovementForControls(this._quaternion, this._angle, data);
        this._angle = movement.angle;
        this._quaternion = movement.quaternion;

        // update geometry
        const vector = new THREE.Vector3(0, 0, RADIUS);
        vector.applyQuaternion(this._quaternion);
        
        this._start.toArray(this._position.array, this._i * 3 * 2);
        vector.toArray(this._position.array, this._i * 3 * 2 + 3);
        this._start = vector;
        
        this._progress.array[this._i * 2] = 1;
        this._progress.array[this._i * 2 + 1] = 1;

        this._position.needsUpdate = true;
        this._progress.needsUpdate = true;

        // update pointer
        this._pointer.position.copy(vector);
        const direction = new THREE.Vector3(Math.sin(this._angle), Math.cos(this._angle), 0);

        const temp = new THREE.Matrix4()
        temp.lookAt(direction, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1));

        this._pointer.quaternion.copy(
            this._quaternion.clone().multiply(new THREE.Quaternion().setFromRotationMatrix(temp))
                .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)));

        ++this._i;
        this._i %= BUFFER_SIZE;
    }
}