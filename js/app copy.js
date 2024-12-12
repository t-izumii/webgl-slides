// import * as THREE from 'three';
import * as THREE from '../node_modules/three/build/three.module.js';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';

class app3 {
    constructor() {
        this.container = document.querySelector('main');
        this.scene = new THREE.Scene();
        this.sceneBg = new THREE.Scene();
        this.mouse = new THREE.Vector2(0.5, 0.5);
        this.prevMouse = new THREE.Vector2(0.5, 0.5);
        this.isPlay = true;
        this.time = 0;
        this.currentWave = 0;



        this.init();
    }

    init() {
        this.createCamera();
        this.createRenderer();
        this.createMesh();
        this.render();
    }

    get viewport(){
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspectRatio = width / height;

        return{
            width,
            height,
            aspectRatio
        }
    }


    createCamera() {
        let perspective = 1000;
        let fov = (180 * (2 * Math.atan(this.viewport.height / 2 / perspective))) / Math.PI;
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000);
        this.camera.position.z = perspective;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(0x000000);
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }

    createMesh() {
        this.max = 50;
        this.meshes = [];
        let geometry = new THREE.PlaneGeometry(50, 50, 1, 1);

        for (let i = 0; i < this.max; i++) {

            let material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
            });

            let mesh = new THREE.Mesh(geometry, material);
            this.meshes.push(mesh);
            this.scene.add(mesh);
        }
    }

    stop() {
        this.isPlay = false;
    }

    start() {
        if(!this.isPlay){
            this.isPlay = true;
            this.render();
        }
    }



    render() {
        if (!this.isPlay) {
            return;
        }
        this.time += 0.01;

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }


    lerp(a, b, n) {
        return (1 - n) * a + n * b;
    }

}
new app3();