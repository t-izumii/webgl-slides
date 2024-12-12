import image1 from '../img/img01.jpg';
import image2 from '../img/img02.jpg';
import image3 from '../img/img03.jpg';
import image4 from '../img/img04.jpg';

let app;
let speed = 0;
let position = 0;
let rounded = 0;
// let block = document.getElementById('block');
// let wrap = document.getElementById('wrap');
// let elems = [...document.querySelectorAll('.n')];
let attractMode = false;
let attractTo = 1;


window.addEventListener('wheel', function(e) {
    speed += e.deltaY * 0.0003;
});

let objs = Array(4).fill({dist:0})

function raf () {
    speed *= 0.9;
    position += speed;

    if (position > 3.3) position = 3.3;
    if (position < -0.4) position = -0.4;
    objs.forEach((o, i) => {
        o.dist = Math.min(Math.abs(position - i), 1);
        o.dist = 1.0 -  o.dist ** 2;
        // elems[i].style.transform = `scale(${ 1.0 + 0.4 * o.dist})`;

        if (app && app.meshes && app.meshes[i]) {
            let scale = 1 + 0.1 * o.dist;
            app.meshes[i].position.y = (i - position) * -450;
            app.meshes[i].scale.set(scale, scale, scale);
            app.meshes[i].material.uniforms.dist = { value: o.dist };
        }
    });

    rounded = Math.round(position);
    let deiff = (rounded - position);

    console.log(rounded);
        if (attractMode) {
            position -= (position - (attractTo - 1.0)) * 0.1;
            // wrap.style.transform = `translateY(${ -position * 100 }px)`;
            if (app && app.group) {
                app.group.rotation.y = app.lerp(app.group.rotation.y, 0, 0.1);
                app.group.rotation.x = app.lerp(app.group.rotation.x, -0.5, 0.1);
                app.group.rotation.z = app.lerp(app.group.rotation.z, 0, 0.1);
                app.group.position.z = app.lerp(app.group.position.z, 200, 0.1);
            }
        } else {
            position += Math.sign(deiff) * Math.pow(Math.abs(deiff), 0.7) * 0.05;
            // wrap.style.transform = `translateY(${ -position * 100 }px)`;
            if (app && app.group) {
                app.group.rotation.y = app.lerp(app.group.rotation.y, -0.5, 0.1);
                app.group.rotation.x = app.lerp(app.group.rotation.x, -0.3, 0.1);
                app.group.rotation.z = app.lerp(app.group.rotation.z, -0.1, 0.1);
                app.group.position.z = app.lerp(app.group.position.z, 0, 0.1);
            }
        }




    window.requestAnimationFrame(raf);
}
raf();

let navs = [...document.querySelectorAll('.nav li')];
let nav = document.querySelector('.nav');

nav.addEventListener('mouseenter', function(e) {
    attractMode = true;
});

nav.addEventListener('mouseleave', function(e) {
    attractMode = false;
});

navs.forEach((li, i) => {
    li.addEventListener('mouseover', function(e) {
        attractTo = Number(li.getAttribute('data-nav'));
    });
});



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
        this.meshes = [];
        this.group = new THREE.Group();



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
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 10000);
        this.camera.position.z = perspective;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(0x333333);
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }

    createMesh() {
        let images = [ image1, image2, image3, image4 ].map(src => ({ src }));
        this.max = 1;
        this.geometry = new THREE.PlaneGeometry(600, 400, 20, 20);
        images.forEach((img, i) => {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
                img.src,
                (texture) => {
                    this.material = new THREE.ShaderMaterial({
                        uniforms: {
                            resolution: { value: new THREE.Vector2() },
                            uTexture: { value: texture },
                        },
                        vertexShader,
                        fragmentShader,
                        side: THREE.DoubleSide,
                        transparent: true,
                        // wireframe: true,
                    });

                    this.mesh = new THREE.Mesh(this.geometry, this.material);
                    this.meshes.push(this.mesh);
                    this.group.add(this.mesh);
                },
            );
        });
        this.scene.add(this.group);

        this.group.rotation.y = -0.5;
        this.group.rotation.x = -0.3;
        this.group.rotation.z = -0.1;
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
        this.time += 0.05;
        this.meshes.forEach(mesh => {
            mesh.material.uniforms.time = { value: this.time };
        });
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }


    lerp(a, b, n) {
        return (1 - n) * a + n * b;
    }

}
app = new app3();