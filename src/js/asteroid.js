import * as THREE from 'three';

import Player from "./components/Player/Player.js";
import BasicBullet from "./components/Bullet/BasicBullet.js";
import BasicAsteroid from "./components/Asteroid/BasicAsteroid.js";
import GameManager from "./components/GameSystem/GameManager.js";

import { OBJLoader } from "./Loader/OBJLoader.js"
import { Object3D, ShaderMaterial, TextureLoader } from "./three/three.module.js";

import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.139/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "https://cdn.jsdelivr.net/npm/three@0.139/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass  } from "https://cdn.jsdelivr.net/npm/three@0.139/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutlinePass } from "https://cdn.jsdelivr.net/npm/three@0.139.2/examples/jsm/postprocessing/OutlinePass.js";
import { FXAAShader } from "https://cdn.jsdelivr.net/npm/three@0.139.2/examples/jsm/shaders/FXAAShader.js"


import Heart from "./components/Joker/Heart.js";
import Coin from "./components/Joker/Coin.js";
import FirePower from "./components/Joker/FirePower.js";
import FireRate from "./components/Joker/FireRate.js";
import Shield from "./components/Joker/Shield.js";
import EnnemySpaceship from "./components/EnnemySpaceship/EnnemySpaceship.js";
import Earth from "./components/Planet/Earth.js";
import Sun from "./components/Planet/Sun.js";
import Explosion from './components/Explosion/Explosion.js';

import { _FS,_VS } from "./components/Shader/Earth/glslEarth.js";
import {_FSAT, _VSAT } from "./components/Shader/Earth/glslAtmosphere.js";
import {_FSBooster, _VSBooster} from "./components/Shader/Player/booster.js";
import {_FSSun, _VSSun} from "./components/Shader/Sun/glslSunShader.js";
import { _FSBloom, _VSBloom}  from "./components/Shader/Postprocess/bloom.js";
import { _FSExplosion, _VSExplosion}  from "./components/Shader/Explosion/explosion.js";
import { _FSBullet, _VSBullet}  from "./components/Shader/Player/bullet.js";
import { vs_shader, fs_shader} from "./components/Shader/shield/glglShield.js"
import { getFBO } from "./components/Shader/FBO/FBO.js";
import SpecialBullet from './components/Bullet/SpecialBullet.js';


class Asteroid {
    constructor() {

        this.Initialize();
        this.loadModel();
        this.loadAudio();

    }

    Initialize() {

        /*camera*/

        this.inGameCamera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 10000);
        this.inGameCamera.fov = 112.5
        this.inGameCamera.position.set(0, 0.3, 0); 

        this.cameraStartMenu = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 2 , 500);
        this.cameraStartMenu.position.set(5,0,15);
        this.cameraStartMenu.lookAt(new THREE.Vector3(-11,0,0));

        /*camera tps*/
        this.goal = new THREE.Object3D;
        this.follow = new THREE.Object3D;
        this.follow.name = "FollowPlayer"
        this.follow.position.z = - 0.3;
        this.goal.add(this.inGameCamera);

        /*scene*/
        this.stageScene = new THREE.Scene();
        this.sceneStartMenu = new THREE.Scene();

        /*renderer*/
        let container = document.querySelector('#siapp');
        let w = container.clientWidth;
        let h = container.clientHeight;

        this.renderer = new THREE.WebGLRenderer({ antialias:true, preserveDrawingBuffer: true });

        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(w, h);
        //this.renderer.toneMapping = THREE.ReinhardToneMapping;
        container.appendChild(this.renderer.domElement);

        /* post process */

            /*----- UnrealBloom Pass -----*/

        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        this.bloomPass.threshold =0;
        this.bloomPass.exposure =0.5;
		this.bloomPass.strength = 2;
		this.bloomPass.radius =0.5;
        this.bloomComposer  = new EffectComposer(this.renderer);
        this.bloomComposer.renderToScreen = false;

        this.finalPass = new ShaderPass(
            new THREE.ShaderMaterial( {
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                },
                vertexShader: _VSBloom(),
                fragmentShader: _FSBloom(),
                defines: {}
            } ), 'baseTexture'
        );
        this.finalPass.needsSwap = true;
        this.finalComposer = new EffectComposer( this.renderer );

            /*----- Outline Pass -----*/

        this.outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), this.stageScene, this.inGameCamera );
        this.outlinePass.edgeStrength = 3;
        this.outlinePass.pulsePeriod = 4;
        this.outlinePass.edgeGlow = 0.076;
        this.outlinePass.edgeThickness = 1.35;
        this.outlinePass.visibleEdgeColor.set('#ffffff');
        this.outlinePass.hiddenEdgeColor.set('#190a05');
            /*----- FXAA Pass -----*/
        
        this.effectFXAA = new ShaderPass( FXAAShader );
        this.effectFXAA.name = "FXAAPass";
        this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

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


        this.inGameCamera.lookAt(this.stageScene.position);

        this.listener = new THREE.AudioListener();
        this.inGameCamera.add(this.listener);

        window.addEventListener('resize', () => {

            this.onWindowResize();

        }, false);

    }

    loadModel() {

        this.modelManager = [];
        this.animationsManager = [];
        this.idleAction = null;

        const loaderObj = new OBJLoader(this.loadingManager);

        /* 
        * texture
        */

        const textureLoader = new TextureLoader(this.loadingManager);

        var materialPlayer = new THREE.MeshPhongMaterial({
            map: textureLoader.load('../medias/models/Player/textures/Andorian (4).png'),
            normalMap: textureLoader.load('../medias/models/Player/textures/Andorian (3).png'),
            bumpMap: textureLoader.load('../medias/models/Player/textures/Husnock (3).png'),
            emissiveMap: textureLoader.load('../medias/models/Player/textures/env.png'),
        });

        var material = new THREE.MeshPhongMaterial({ map: textureLoader.load('../medias/models/textures/asteroid_diffuse.jpg') })
        var materialCoin = new THREE.MeshPhongMaterial({ map: textureLoader.load('../medias/models/collectable/coin/textures/Coin_Gold_albedo.png') });
        var materialEnnemySS = new THREE.MeshPhongMaterial({ map: textureLoader.load('../medias/models/Ennemy/textures/E-45 _col.jpg')});
        /* 
        *   Balle Joueur
        */


        const bulletPlayer = new THREE.Mesh(
            new THREE.CylinderGeometry(5, 50, 50),
            new THREE.MeshBasicMaterial({ color: 0xffff00 }));
        bulletPlayer.name = "BulletPlayer";
        bulletPlayer.rotateX((Math.PI / 180) * 90);

        /*
        * Special Bullet
        */
        this.specialBulletMaterial = new THREE.ShaderMaterial({
            vertexShader: _VSBullet(),
            fragmentShader: _FSBullet(),
            uniforms: {
                time: { 
                  type: "f",
                  value: 0.05
                },
            },
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide

        })
        this.specialBulletMaterial.parentName = "SpecialBullet";

        const specialBulletMesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(0.5, 50, 50),
            new ShaderMaterial(),
        )
        specialBulletMesh.name = "SpecialBulletItem";
    

        /* 
        *   Balle Ennemy
        */
        const cylinderMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(5, 50, 50),
            new THREE.MeshLambertMaterial({ color: 0xff0000,emissive : 0xff000d }));
       /* const geometryBullet = new THREE.CylinderBufferGeometry(0.01, 0.01, 0.1, 5, 1, false);*/
        cylinderMesh.name = "BulletEnnemy";
        cylinderMesh.rotateX((Math.PI / 180) * 90);

        /* 
        *   Item +1 Bullet
        */
        const firePowerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const firePowerMaterial = new THREE.MeshBasicMaterial({ 
            map: textureLoader.load("../medias/images/power-up/firepower.PNG") ,
            color: 0xff0000 });
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
        const depth = getFBO(1, 1, {
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType,
          });

        this.materialShield = new THREE.ShaderMaterial({
            uniforms: {
              depthBuffer: { value:  depth.texture },
              resolution: { value: new THREE.Vector2(1, 1) },
              time: { value: 0 },
            },
            vertexShader: vs_shader,
            fragmentShader: fs_shader,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
          });
        this.materialShield.parentName = "Shield";
        const shieldMesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(0.3, 5), this.material);
        shieldMesh.name = "ShieldItem";

        /*
        * Sun 
        */

       /* this.shaderExplosion = new THREE.ShaderMaterial({
            vertexShader: _VSExplosion(),
            fragmentShader: _FSExplosion(),
            transparent: true,
            uniforms:{
                tExplosion: {
                    value: textureLoader.load("../medias/images/explosion/explosion.png"),
                    
                },
                time: { // float initialized to 0
                    type: "f",
                    value: 0.0
                  },
                growTime:{
                    type: "f",
                    value: 0.0
                },
                opacity:{
                    type: "f",
                    value: 1.0
                },
                weight: { type: "f", value: 10.0 }
                
            }

        })*/

        this.sunMaterial = new THREE.ShaderMaterial({
            vertexShader: _VSSun(),
            fragmentShader: _FSSun(),
            uniforms:{
                globeTexture: {
                    value: textureLoader.load("../medias/images/sun/sun.jpg"),
                    
                },
                time: { // float initialized to 0
                    type: "f",
                    value: 0.0
                  },
                growTime:{
                    type: "f",
                    value: 0.0
                },
                n:{
                    type: "f",
                    value: 0.0
                },
                intensity:{
                    type: "f",
                    value: 1.2
                },
                
                
            }

        });
        this.sunMaterial.parentName = "Sun";

        const sunMesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(5, 50, 50),
            new ShaderMaterial(),
        )
        sunMesh.rotateY((Math.PI / 180)* 280)
        sunMesh.name = "SunItem";

        /*
        * SunAtmosphere
        */
        
       /* this.sunAtmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(5, 50, 50),
            new THREE.ShaderMaterial( 
                {
                    uniforms: { 
                        sunTexture: {
                            value: textureLoader.load("../medias/images/sun/glow2.png")
                        } 
                    },
                    vertexShader: _VSSunShader(),
                    fragmentShader: _FSSunShader(),
                    side: THREE.DoubleSide,
                    blending: THREE.AdditiveBlending,
                    transparent: true,
            })
        );*/

        /*
        * Star
        */

            const starGeometry = new THREE.BufferGeometry();
            const starMaterial = new THREE.PointsMaterial({
                color : 0xffffff,
                }
            )

            this.stars = new THREE.Points(starGeometry,starMaterial);
            
        /*
        * planet 
        */
        this.earthMaterial = new THREE.ShaderMaterial({
            vertexShader: _VS(),
            fragmentShader: _FS(),
            uniforms:{
                globeTexture: {
                    value: textureLoader.load("../medias/images/earth/earth2.jpg"),
                    
                },
                
            }
        });
        this.earthMaterial.parentName = "Earth";

        const earthMesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(5 , 50, 50),
            new ShaderMaterial(),
        )
        earthMesh.rotateY((Math.PI / 180)* 280)
        earthMesh.name = "EarthItem";

        /*
        * Atmosphere
        */

        this.atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(5, 50, 50),
            new THREE.ShaderMaterial({
                vertexShader: _VSAT(),
                fragmentShader: _FSAT(),
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
    
            })
        )

        /*
        * Explosion
        */
        
        this.shaderExplosion = new THREE.ShaderMaterial({
            vertexShader: _VSExplosion(),
            fragmentShader: _FSExplosion(),
            transparent: true,
            uniforms:{
                tExplosion: {
                    value: textureLoader.load("../medias/images/explosion/explosion.png"),
                    
                },
                time: { // float initialized to 0
                    type: "f",
                    value: 0.0
                  },
                growTime:{
                    type: "f",
                    value: 0.0
                },
                opacity:{
                    type: "f",
                    value: 1.0
                },
                weight: { type: "f", value: 10.0 }
                
            }

        })
        this.shaderExplosion.parentName = "Explosion";
        const explosion = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.5,10),
            new ShaderMaterial(),
        )
        
        explosion.name = "explosion";

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
                      value: 0.05
                    },
                    uniformZ:{
                        type:"f",
                        value:0.03
                    },
                    uniformX:{
                        type:"f",
                        value:0.03
                    },
                    boostPower:{
                        type:"f",
                        value:0.03,
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
        this.modelManager.push(cylinderMesh);this.modelManager.push(firePower);this.modelManager.push(fireRate);
        this.modelManager.push(earthMesh);this.modelManager.push(bulletPlayer);this.modelManager.push(shieldMesh);
        this.modelManager.push(sunMesh); this.modelManager.push(explosion); this.modelManager.push(specialBulletMesh)

        /*
        * ObjectLoader
        */
        loaderObj.load('../medias/models/low_poly.obj', (object) => {

            object.traverse(function (child) {

                if (child.isMesh){ 
                    child.name = "spaceRock";
                    child.material = material
                };

            });

            object.name = "SpaceRock";
            this.modelManager.push(object);

        });

        loaderObj.load('../medias/models/Ennemy/ennemy_ss.obj', (object) => {

            object.traverse(function (child) {

                if (child.isMesh){
                    child.name = "ennemyShipMesh";
                    child.material = materialEnnemySS;
                } 

            });

          //  object.children[0].rotateY();
            object.name = "EnnemySpaceship";
            object.children[0].rotateY((Math.PI / 180)* 180)
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

                if (child.isMesh){
                    child.name = "playerMesh";
                    child.material = materialPlayer;
                } 

            });

            object.name = "SpaceShip";
            this.modelManager.push(object);

        });

    }

    loadAudio() {

        this.audioManager = [];

        this.sound = new THREE.PositionalAudio(this.listener);

        const audioLoader = new THREE.AudioLoader(this.loadingManager);
        let me = this;
        audioLoader.load('../medias/sounds/coin/coin.mp3', function (buffer) {
            buffer.name = "Coin";
            me.audioManager.push(buffer);
        });

        audioLoader.load('../medias/sounds/ennemyShip/laser-ennemy.mp3', function (buffer) {
            buffer.name = "ennemyLaser";
            me.audioManager.push(buffer);
        });

        audioLoader.load('../medias/sounds/bullet/plasma-pistol.mp3', function (buffer) {
            buffer.name = "powerShot";
            me.audioManager.push(buffer);
        });

        audioLoader.load('../medias/sounds/heart/heart.mp3', function (buffer) {
            buffer.name = "Heart";
            me.audioManager.push(buffer);
        });

        audioLoader.load('../medias/sounds/bullet/bullet.wav', function (buffer) {
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
        /*-*/
        audioLoader.load('../medias/sounds/player/spawn-sound.mp3', function (buffer) {
            buffer.name = "ShipRespawn";
            me.audioManager.push(buffer);
        });

        audioLoader.load('../medias/sounds/shield/energy_shield.mp3', function (buffer) {
            buffer.name = "EnergyShield";
            me.audioManager.push(buffer);
        });

        audioLoader.load('../medias/sounds/asteroid/asteroid_explosion.mp3', function (buffer) {
            buffer.name = "AsteroidExplosion";
            me.audioManager.push(buffer);
        });

        audioLoader.load('../medias/sounds/startMenu/outer-wilds-timber-hearth.mp3', function (buffer) {
            buffer.name = "StartMenuTheme";
            me.audioManager.push(buffer);
        });

        audioLoader.load('../medias/sounds/stage2/outer-wilds-dark-bramble.mp3', function (buffer) {
            buffer.name = "stage2-ambient";
            me.audioManager.push(buffer);
        });
        audioLoader.load('../medias/sounds/stage1/outer-wilds-the-museum.mp3', function (buffer) {
            buffer.name = "stage1-ambient";
            me.audioManager.push(buffer);
        });
        audioLoader.load('../medias/sounds/stage3/end-times.mp3', function (buffer) {
            buffer.name = "stage3-ambient";
            me.audioManager.push(buffer);
        });
        audioLoader.load('../medias/sounds/stage3/outer-wilds-supernova.mp3', function (buffer) {
            buffer.name = "stage3-supernova";
            me.audioManager.push(buffer);
        });


    }

    loadProps() {

        let playerModel, rockModel,heartModel, coinModel, ennemy_ssModel;
        let bulletEnnemy = new Object3D(); let bulletPlayer= new Object3D(); let firePowerModel= new Object3D(); 
        let fireRateModel= new Object3D(); let shieldModel= new Object3D(); let earthModel = new Object3D();
        let sunModel = new Object3D(); let explosionModel = new Object3D(); let specialeBullet = new Object3D();



        this.modelManager.forEach((e) => {
            if (e.name == "SpaceShip") playerModel = e;

            if (e.name == "SpaceRock") rockModel = e

            if (e.name == "BulletPlayer") bulletPlayer.add(e);

            if (e.name == "SpecialBulletItem") specialeBullet.add(e);

            if (e.name == "BulletEnnemy") bulletEnnemy.add(e);

            if (e.name == "ShieldItem") shieldModel.add(e);

            if (e.name == "EarthItem") earthModel.add(e);

            if (e.name == "explosion") explosionModel.add(e);

            if (e.name == "SunItem") sunModel.add(e);

            if (e.name == "HeartItem") heartModel = e;

            if (e.name == "CoinItem") coinModel = e;

            if (e.name == "firePowerItem") firePowerModel.add(e);

            if (e.name == "fireRateItem") fireRateModel.add(e);

            if (e.name == "EnnemySpaceship") ennemy_ssModel = e

        })




        const audio = {

            audioManager: this.audioManager,
            //sound: this.sound,
            listener: this.listener

        }

        this.params = {

            goal: this.goal,
            camera: this.inGameCamera,
            follow: this.follow,

        }

        const utils = {

            renderer: this.renderer,
            stageScene: this.stageScene,
            sceneStartMenu: this.sceneStartMenu,
            inGameCamera: this.inGameCamera,
            startMenuCamera: this.cameraStartMenu,
            loop: this.loop,

        }

        const postProcess = {

            finalComposer: this.finalComposer,
            bloomComposer : this.bloomComposer,

            bloomPass: this.bloomPass,
            effectFXAA: this.effectFXAA,
            outlinePass: this.outlinePass,
            finalPass : this.finalPass,         

        }

        const shaders = {     

            astmosphere :  this.atmosphere,
          //  sunAtmosphere: this.sunAtmosphere,
            booster : this.booster,
            stars: this.stars,

            specialBullet: this.specialBulletMaterial,
            explosionShader : this.shaderExplosion,
            earthShader: this.earthMaterial,
            sunShader: this.sunMaterial,
            shieldShader : this.materialShield,
            
 
         }

        const models = {

            player: new Player(playerModel, audio,this.params),
            ennemy_ss: new EnnemySpaceship(ennemy_ssModel,audio,0),
            asteroid: new BasicAsteroid(rockModel,audio, 0),
            
            earth: new Earth(earthModel,audio,0),
            sun: new Sun(sunModel,audio, 0),

            basicBullet: new BasicBullet(bulletPlayer, audio),
            ennemyBullet: new BasicBullet(bulletEnnemy, audio),
            specialBullet: new SpecialBullet(specialeBullet,audio),

            coin: new Coin(coinModel,audio, 0),
            firepower: new FirePower(firePowerModel,audio, 0),
            firerate: new FireRate(fireRateModel,audio, 0),
            shield: new Shield(shieldModel,audio, 0),
            heart: new Heart(heartModel,audio, 0),
            
            explosion: new Explosion(explosionModel, audio),
        }

        this.gm = new GameManager(models, utils, audio, shaders, postProcess)
        this.gm.ModelInitialisation();
        this.gm.ValueInitialisation();

        this.remove = null;

        document.addEventListener('keydown', this.remove = this.onPlayerBegin.bind(this))
        document.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);

    }

    onPlayerBegin(event) { // nom a changer

        (this.gm.currentScene)
        if (event.code == 'Space') {

            document.getElementById("start_game").style.display = "none";
            document.removeEventListener('keydown', this.remove);
            this.gm.state.start = true;
            
            this.gm.GetComponent("LevelSystem").scenePicker("Stage3", true);

        }

    }

    onMouseWheel(event) {

        var fovMAX = 160;
        var fovMIN = 1;
        this.inGameCamera.fov -= event.wheelDeltaY * 0.05;
        this.inGameCamera.fov = Math.max(Math.min(this.inGameCamera.fov, fovMAX), fovMIN);
        this.inGameCamera.updateProjectionMatrix();
    }

    onWindowResize() {

        this.inGameCamera.aspect = window.innerWidth / window.innerHeight;
        this.inGameCamera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.bloomComposer.setSize( window.innerWidth, window.innerHeight );
		this.finalComposer.setSize( window.innerWidth, window.innerHeight );

    }

    onTransitionEnd(event) {

        event.target.remove();
        this.loadProps();

    }

}
let _App = new Asteroid();


