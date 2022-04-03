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
import FireRate from "./components/Joker/FireRate.js";
import Shield from "./components/Joker/Shield.js";
import EnnemySpaceship from "./components/EnnemySpaceship/EnnemySpaceship.js";
import Earth from "./components/Planet/Earth.js";

import { _FS,_VS } from "./components/Planet/glslEarth.js";
import {_FSAT, _VSAT } from "./components/Planet/glslAtmosphere.js";
import {_FSBooster, _VSBooster} from "./components/Player/booster.js"

class Asteroid {
    constructor() {

        this.Initialize();
        this.LoadModel();
        this.LoadAudio();

    }

    Initialize() {

        /*camera*/

        this.inGameCamera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 10000);
        this.inGameCamera.fov = 112.5
        this.inGameCamera.position.set(0, 0.3, 0); 

        this.cameraStartMenu = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 2 , 500);
        this.cameraStartMenu.position.set(5,0,15);

        /*camera tps*/
        this.goal = new THREE.Object3D;
        this.follow = new THREE.Object3D;
        this.follow.name = "FollowPlayer"
        this.follow.position.z = - 0.3;
        this.goal.add(this.inGameCamera);

        /*scene*/
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.sceneStartMenu = new THREE.Scene();

        /*renderer*/
        let container = document.querySelector('#siapp');
        let w = container.clientWidth;
        let h = container.clientHeight;

        this.renderer = new THREE.WebGLRenderer({ antialias:true, preserveDrawingBuffer: true });
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.setSize(w, h);
        container.appendChild(this.renderer.domElement);

        /* post process */
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.inGameCamera));

        var pixelPass = new ShaderPass(PixelShader);
        pixelPass.uniforms['resolution'].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
        pixelPass.uniforms['resolution'].value.multiplyScalar(window.devicePixelRatio);
        this.composer.addPass(pixelPass);

        /*timer*/
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

        /*loading*/
        this.loadingManager = new THREE.LoadingManager(() => {

            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('fade-out');

            loadingScreen.addEventListener('transitionend', (e) => {
                this.onTransitionEnd(e)
            }, false);

        });


        this.inGameCamera.lookAt(this.scene.position);

        this.listener = new THREE.AudioListener();
        this.inGameCamera.add(this.listener);

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
        *   Cooldown fireRate
        */
        const fireRateGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const fireRateMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load("../medias/images/power-up/cooldown.png") ,color: 0xEFDEDE });
        const fireRate = new THREE.Mesh(fireRateGeometry, fireRateMaterial);
        fireRate.name = "fireRateItem";

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
        console.log(_FS)
        const earthMaterial = new THREE.ShaderMaterial({
            vertexShader: _VS(),
            fragmentShader: _FS(),
            uniforms:{
                globeTexture: {
                    value: textureLoader.load("../medias/images/earth/earth2.jpg"),
                    
                },
                
            }
           /* normalMap: textureLoader.load("../medias/images/earth/earth_normal_map.jpg"),
            specularMap: textureLoader.load("../medias/images/earth/earth_specular_map.tif")*/
        });
        const earthGeometry = new THREE.SphereBufferGeometry(5, 50, 50);
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        earthMesh.rotateY((Math.PI / 180)* 280)
        earthMesh.name = "EarthItem";

        /*
        * Atmosphere
        */

        this.atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(6, 50, 50),
            new THREE.ShaderMaterial({
                vertexShader: _VSAT(),
                fragmentShader: _FSAT(),
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
    
            })

        )

        /*
        * Booster
        */

        this.booster = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 50, 50),
            new THREE.ShaderMaterial({
                vertexShader: _VSBooster(),
                fragmentShader: _FSBooster(),
                uniforms: {
                    time: { // float initialized to 0
                      type: "f",
                      value: 0.0
                    }
                },
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
    
            })

        )
        this.booster.name = "booster";
        this.booster.rotateY( (Math.PI / 180) * 90)

        /* 
        * ModelManager
        */
        this.modelManager.push(cylinderMesh);
        this.modelManager.push(firePower);
        this.modelManager.push(fireRate);
        this.modelManager.push(earthMesh);
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

            object.children[0].rotateY();
            object.name = "EnnemySpaceship";
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

        let playerModel, rockModel,heartModel, coinModel, ennemy_ssModel;
        let bulletEnnemy = new Object3D(); let bulletPlayer= new Object3D(); let firePowerModel= new Object3D(); 
        let fireRateModel= new Object3D(); let shieldModel= new Object3D(); let earthModel = new Object3D();

        this.modelManager.forEach((e) => {

            if (e.name == "SpaceShip") playerModel = e;

            if (e.name == "SpaceRock") rockModel = e

            if (e.name == "BulletPlayer") bulletPlayer.add(e);

            if (e.name == "BulletEnnemy") bulletEnnemy.add(e);

            if (e.name == "ShieldItem") shieldModel.add(e);

            if (e.name == "EarthItem") earthModel.add(e);

            if (e.name == "HeartItem") heartModel = e;

            if (e.name == "CoinItem") coinModel = e;

            if (e.name == "firePowerItem") firePowerModel.add(e);

            if (e.name == "fireRateItem") fireRateModel.add(e);

            if (e.name == "EnnemySpaceship") ennemy_ssModel = e

        })
        const audio = {

            audioManager: this.audioManager,
            sound: this.sound,
            listener: this.listener

        }

        this.params = {

            goal: this.goal,
            camera: this.inGameCamera,
            follow: this.follow,

           // scene: this.stageScene,

        }

        const utils = {

            composer: this.composer,
            renderer: this.renderer,
            scene: this.stageScene,
            sceneStartMenu: this.sceneStartMenu,
            inGameCamera: this.inGameCamera,
            startMenuCamera: this.cameraStartMenu,
            loop: this.loop,

        }

        const animations = {
            mixer: null/*this.animationsManager[0]*/,
            idleAction: null/* this.idleAction*/,
        }

        const shaders ={

            astmosphere :  this.atmosphere,
            booster : this.booster,
 
         }

        const models = {

            player: new Player(playerModel, audio,this.params),//A changer pour le joueur ?
            ennemy_ss: new EnnemySpaceship(ennemy_ssModel,0),
            asteroid: new BasicAsteroid(rockModel, 0),
            coin: new Coin(coinModel, 0),
            earth: new Earth(earthModel,0),
            firepower: new FirePower(firePowerModel, 0),
            firerate: new FireRate(fireRateModel, 0),
            shield: new Shield(shieldModel, 0),
            heart: new Heart(heartModel, 0),
            basicBullet: new BasicBullet(bulletPlayer, audio),
            ennemyBullet: new BasicBullet(bulletEnnemy, audio),

        }

        this.gm = new GameManager(models, utils, animations, audio, shaders)
        this.gm.ModelInitialisation();
        this.gm.ValueInitialisation();

        this.remove = null;

        document.addEventListener('keydown', this.remove = this.OnPlayerBegin.bind(this))
        document.addEventListener('mousewheel', this.OnMouseWheel.bind(this), false);

    }

    OnPlayerBegin(event) { // nom a changer


        if (event.code == 'Space') {

            // document.getElementById("start_game").style.display = "none";
            document.removeEventListener('keydown', this.remove);
            this.gm.state.start = true;
            this.gm.GetComponent("LevelSystem").ScenePicker("Stage1", true);

        }

    }

    OnMouseWheel(event) {

        var fovMAX = 160;
        var fovMIN = 1;
        this.inGameCamera.fov -= event.wheelDeltaY * 0.05;
        this.inGameCamera.fov = Math.max(Math.min(this.inGameCamera.fov, fovMAX), fovMIN);
        this.inGameCamera.updateProjectionMatrix();
    }

    OnWindowResize() {

        this.inGameCamera.aspect = window.innerWidth / window.innerHeight;
        this.inGameCamera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);

    }

    onTransitionEnd(event) {

        event.target.remove();
        this.LoadProps();

    }

}

let _App = new Asteroid();


