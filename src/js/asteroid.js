import Player from "./components/Player/Player.js";
import BasicBullet from "./components/Bullet/BasicBullet.js";
import BasicAsteroid from "./components/Asteroid/BasicAsteroid.js";
import GameManager from "./components/GameSystem/GameManager.js";

import { OBJLoader } from "./Loader/OBJLoader.js"
import { Object3D, TextureLoader } from "./three/three.module.js";

import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/postprocessing/ShaderPass.js";
import { PixelShader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/shaders/PixelShader.js";

import Heart from "./components/Joker/Heart.js";
import Coin from "./components/Joker/Coin.js";
import FirePower from "./components/Joker/FirePower.js";
import Shield from "./components/Joker/Shield.js";
import EnnemySpaceship from "./components/EnnemySpaceship/EnnemySpaceship.js";
import Explosion from "./components/Explosion/Explosion.js";

class Asteroid {
    constructor() {

        this.Initialize();
        this.LoadModel();
        this.LoadAudio();
        this.LoadScene();

    }

    Initialize() {

        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 10000);
        this.camera.fov = 112.5

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        this.loop = {}

        const fps = 60;
        const slow = 1;
        this.loop.dt = 0,
        this.loop.now = window.performance.now();
        this.loop.last = this.loop.now;
        this.loop.fps = fps;
        this.loop.step = 1 / this.loop.fps;
        this.loop.slow = slow;
        this.loop.slowStep = this.loop.slow * this.loop.step;

        this.loadingManager = new THREE.LoadingManager(() => {

            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('fade-out');

            loadingScreen.addEventListener('transitionend', (e) => {
                this.onTransitionEnd(e)
            }, false);

        });

        this.camera.position.set(0, 0.3, 0); //0.3 troisieme personne, 2/3 vu en follow, 
        this.camera.lookAt(this.scene.position);

        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);

        this.goal = new THREE.Object3D;
        this.follow = new THREE.Object3D;
        this.follow.name = "FollowPlayer"
        this.follow.position.z = - 0.3;
        this.goal.add(this.camera);

        window.addEventListener('resize', () => {

            this.OnWindowResize();

        }, false);

    }

    LoadModel() {

        this.modelManager = [];
        this.animationsManager = [];
        this.idleAction = null;

        const loaderObj = new OBJLoader(this.loadingManager);

        /* 
        * texture
        */

        const textureLoader = new TextureLoader(this.loadingManager);

        var mapPlayer = textureLoader.load('../medias/models/Player/textures/Andorian (4).png');
        var normalPlayer1 = textureLoader.load('../medias/models/Player/textures/Andorian (3).png');
        var normalPlayer2 = textureLoader.load('../medias/models/Player/textures/Husnock (3).png');
        var envPlayer = textureLoader.load('../medias/models/Player/textures/env.png');
        var materialPlayer = new THREE.MeshPhongMaterial({
            map: mapPlayer,
            normalMap: normalPlayer1,
            bumpMap: normalPlayer2,
            emissiveMap: envPlayer,
        });

        var material = new THREE.MeshPhongMaterial({ map: textureLoader.load('../medias/models/textures/asteroid_diffuse.jpg') })
        var materialCoin = new THREE.MeshPhongMaterial({ map: textureLoader.load('../medias/models/collectable/coin/textures/Coin_Gold_albedo.png') });
        var materialEnnemySS = new THREE.MeshPhongMaterial({ map: textureLoader.load('../medias/models/Ennemy/textures/E-45 _col.jpg') });
        /* 
        *   Balle Joueur
        */
        const geometryBullet = new THREE.CylinderBufferGeometry(0.01, 0.01, 0.1, 5, 1, false);
        const materialBullet = new THREE.MeshLambertMaterial();
        materialBullet.color.set(0xff0000);
        materialBullet.emissive.set(0xff000d);

        const geometryBulletPlayer = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 5, 1, false);
        const materialBulletPlayer = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const bulletPlayer = new THREE.Mesh(geometryBulletPlayer, materialBulletPlayer);
        bulletPlayer.name = "BulletPlayer";
        bulletPlayer.rotateX((Math.PI / 180) * 90);
        /* 
        *   Balle Ennemy
        */
        const cylinderMesh = new THREE.Mesh(geometryBullet, materialBullet);
        cylinderMesh.name = "BulletEnnemy";
        cylinderMesh.rotateX((Math.PI / 180) * 90);

        /* 
        *   Item +1 Bullet
        */
        const firePowerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const firePowerMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load("../medias/images/power-up/firepower.PNG") ,color: 0xff0000 });
        const firePower = new THREE.Mesh(firePowerGeometry, firePowerMaterial);
        firePower.name = "firePowerItem";

        /* 
        *   Shield
        */
        const geometryShield = new THREE.SphereGeometry(0.23, 12, 10);
        const materialShield = new THREE.MeshStandardMaterial({ color: 0xffdd00, emissive: 0xecc70e, transparent: true, opacity: 0.5, alphaTest: 0.1 });
        const shieldMesh = new THREE.Mesh(geometryShield, materialShield);
        shieldMesh.name = "ShieldItem";

        /*
        * planet 
        */
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load("../medias/images/earth/earth.jpg"),
            normalMap: textureLoader.load("../medias/images/earth/earth_normal_map.jpg"),
            specularMap: textureLoader.load("../medias/images/earth/earth_specular_map.tif")
        });
        const earthGeometry = new THREE.SphereBufferGeometry(20, 50, 50);
        this.earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        this.earthMesh.position.set(0,-20,60)

        this.scene.add(this.earthMesh);

        /* 
        * ModelManager
        */
        this.modelManager.push(cylinderMesh);
        this.modelManager.push(firePower);
        this.modelManager.push(bulletPlayer);
        this.modelManager.push(shieldMesh);
        loaderObj.load('../medias/models/low_poly.obj', (object) => {

            object.traverse(function (child) {

                if (child.isMesh) child.material = material;

            });

            object.name = "SpaceRock";
            this.modelManager.push(object);

        });

        loaderObj.load('../medias/models/Ennemy/ennemy_ss.obj', (object) => {

            object.traverse(function (child) {

                if (child.isMesh) child.material = materialEnnemySS;

            });

            object.children[0].rotateY((Math.PI / 180) * 180);
            object.name = "EnnemySpaceship";
            this.modelManager.push(object);

        });

        loaderObj.load('../medias/models/explosion.obj', (object) => {

            object.name = "Explosion";
            this.modelManager.push(object);

        });

        loaderObj.load("../medias/models/collectable/Love.obj", (object) => {

            object.name = "HeartItem";
            this.modelManager.push(object)

        });

        loaderObj.load("../medias/models/collectable/coin/Coin.obj", (object) => {

            object.traverse(function (child) {

                if (child.isMesh) child.material = materialCoin;

            });

            object.name = "CoinItem";
            this.modelManager.push(object)

        });

        loaderObj.load('../medias/models/Player/SpaceShip.obj', (object) => {

            object.traverse(function (child) {

                if (child.isMesh) child.material = materialPlayer;

            });

            object.name = "SpaceShip";
            this.modelManager.push(object);

        });

    }

    LoadAudio() {

        this.audioManager = [];

        this.sound = new THREE.Audio(this.listener);

        const audioLoader = new THREE.AudioLoader(this.loadingManager);
        let me = this;
        audioLoader.load('../medias/sounds/coin/coin.mp3', function (buffer) {
            buffer.name = "Coin";
            me.audioManager.push(buffer);
        });

        audioLoader.load('../medias/sounds/heart/heart.mp3', function (buffer) {
            buffer.name = "Heart";
            me.audioManager.push(buffer);
        });

        audioLoader.load('../medias/sounds/bullet/bullet.mp3', function (buffer) {
            buffer.name = "Bullet";
            me.audioManager.push(buffer);
        });

        audioLoader.load('../medias/sounds/hit/hit.mp3', function (buffer) {
            buffer.name = "BulletHit";
            me.audioManager.push(buffer);
        });

        audioLoader.load('../medias/sounds/ship/ship.mp3', function (buffer) {
            buffer.name = "ShipDamageTaken";
            me.audioManager.push(buffer);
        });


    }

    LoadProps() {

        let playerModel; let rockModel; let heartModel; let coinModel; let ennemy_ssModel;

        let bulletEnnemy = new Object3D();
        let bulletPlayer = new Object3D();
        let firePowerModel = new Object3D();
        let shieldModel = new Object3D();
        this.modelManager.forEach((e) => {

            if (e.name == "SpaceShip") playerModel = e;

            if (e.name == "SpaceRock") rockModel = e

            if (e.name == "BulletPlayer") bulletPlayer.add(e);

            if (e.name == "BulletEnnemy") bulletEnnemy.add(e);

            if (e.name == "ShieldItem") shieldModel.add(e);

            if (e.name == "HeartItem") heartModel = e;

            if (e.name == "CoinItem") coinModel = e;

            if (e.name == "firePowerItem") firePowerModel.add(e);

            if (e.name == "EnnemySpaceship") ennemy_ssModel = e

        })

        const audio = {

            audioManager: this.audioManager,
            sound: this.sound,
            listener: this.listener

        }

        this.params = {

            goal: this.goal,
            camera: this.camera,
            follow: this.follow,

            scene: this.scene,

        }

        const utils = {

            composer: this.composer,
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera,
            loop: this.loop,

        }

        const animations = {
            mixer: null/*this.animationsManager[0]*/,
            idleAction: null/* this.idleAction*/,
        }

        const particule = {

            particuleExplosion: new Explosion(this.scene, this.camera),

        }

        const models = {

            player: new Player(this.params, playerModel, audio),
            ennemy_ss: new EnnemySpaceship(this.scene, ennemy_ssModel),
            asteroid: new BasicAsteroid(this.scene, rockModel, 0),
            coin: new Coin(this.scene, coinModel, 0),
            firepower: new FirePower(this.scene, firePowerModel, 0),
            shield: new Shield(this.scene, shieldModel, 0),
            heart: new Heart(this.scene, heartModel, 0),
            basicBullet: new BasicBullet(this.scene, bulletPlayer, audio),
            ennemyBullet: new BasicBullet(this.scene, bulletEnnemy, audio),

        }

        this.gm = new GameManager(models, utils, animations, audio, particule)
        this.gm.ModelInitialisation();
        this.gm.ValueInitialisation();

        this.remove = null;

        document.addEventListener('keydown', this.remove = this.OnPlayerBegin.bind(this))
        document.addEventListener('mousewheel', this.OnMouseWheel.bind(this), false);

    }

    LoadScene() {

        let container = document.querySelector('#siapp');
        let w = container.clientWidth;
        let h = container.clientHeight;

        /* renderer */
        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.setSize(w, h);
        container.appendChild(this.renderer.domElement);

        /* post process */
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        var pixelPass = new ShaderPass(PixelShader);
        pixelPass.uniforms['resolution'].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
        pixelPass.uniforms['resolution'].value.multiplyScalar(window.devicePixelRatio);
        this.composer.addPass(pixelPass);

        var gridHelper = new THREE.GridHelper(40, 40);
        this.scene.add(gridHelper);

        this.scene.add(new THREE.AxesHelper());
        const light = new THREE.AmbientLight(0xffffff, 1)
        light.position.set(0, 10, 0)

        this.scene.add(light);

    }

    OnPlayerBegin(event) { // nom a changer


        if (event.code == 'Space') {

            // document.getElementById("start_game").style.display = "none";
            document.removeEventListener('keydown', this.remove);
            this.gm.state.start = true;
            this.gm.GetComponent("DisplaySystem").printUIHeader(1, 0);
            this.gm.GetComponent("LevelSystem").StartLevel(1, true);

        }

    }

    OnMouseWheel(event) {

        var fovMAX = 160;
        var fovMIN = 1;
        this.camera.fov -= event.wheelDeltaY * 0.05;
        this.camera.fov = Math.max(Math.min(this.camera.fov, fovMAX), fovMIN);
        this.camera.updateProjectionMatrix();
    }

    OnWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);

    }

    onTransitionEnd(event) {

        event.target.remove();
        this.LoadProps();

    }

}

let _App = new Asteroid();


