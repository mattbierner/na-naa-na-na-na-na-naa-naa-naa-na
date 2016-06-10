import THREE from 'three';
import OrbitControls from './OrbitControls';
import Shader from './shader';
const ResizeSensor = require('imports?this=>window!css-element-queries/src/ResizeSensor');


/**
 * 3D view
 */
export default class BaseViewer {
    constructor(canvas, container) {
        this.isMouseDown = false;
        this.container = container;

        this.mouse = null;
        this._toUpdate = [];

        this._raycaster = new THREE.Raycaster();
        this._clock = new THREE.Clock();

        this._scene = new THREE.Scene();

        this.initRenderer(canvas);
        this.initCamera();
        this.initControls(container);

        new ResizeSensor(container, this.onWindowResize.bind(this));
        this.onWindowResize();

        this.animate = () => this.animateImpl();
        this.animateImpl();
    }

    /**
     * Setup the initial renderer.
     */
    initRenderer(canvas) {
        this._renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this._renderer.setClearColor(0xffffff, 0);
        this._renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    }

    /**
     * Setup the initial camera.
     */
    initCamera() {
        const [viewWidth, viewHeight] = this._getViewportSize();
        const aspect = viewWidth / viewHeight;
        this._camera = new THREE.PerspectiveCamera(75, aspect, 0.01, 800);
        this._camera.position.z = Math.abs(aspect / Math.sin(this._camera.fov * ( Math.PI / 180 ) / 2));
    }

    /**
     * Setup the controls.
     */
    initControls(container) {
        this._controls = new OrbitControls(this._camera, container);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.25;
        this._controls.enableZoom = true;
    }

    /**
     * Get the size of the viewport.
     */
    _getViewportSize() {
        const rect = this.container.getBoundingClientRect();
        return [rect.width, rect.height];
    }

    /**
     * Handle window resize events.
     */
    onWindowResize() {
        const [width, height] = this._getViewportSize();

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(width, height);
    }

    update(delta) {
        this._controls.update();

        for (const x of this._toUpdate)
            x(delta);
    }

    animateImpl() {
        const delta = this._clock.getDelta();

        this.update(delta);
        this.render(delta);
        requestAnimationFrame(this.animate);
    }

    render(delta) {
        this._renderer.render(this._scene, this._camera);
    }
}