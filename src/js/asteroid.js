import * as THREE from 'three';

import Player from "./components/GameObject/Player/Player.js";
import BasicBullet from "./components/GameObject/Bullet/BasicBullet.js";
import BasicAsteroid from "./components/GameObject/Asteroid/BasicAsteroid.js";
import GameManager from "./components/GameSystem/GameManager.js";

import { OBJLoader } from "./Loader/OBJLoader.js"
import { FBXLoader } from "https://cdn.jsdelivr.net/npm/three@0.139.2/examples/jsm/loaders/FBXLoader.js"
import { Object3D, ShaderMaterial, TextureLoader } from "./three/three.module.js";

import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.139/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "https://cdn.jsdelivr.net/npm/three@0.139/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.139/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutlinePass } from "https://cdn.jsdelivr.net/npm/three@0.139.2/examples/jsm/postprocessing/OutlinePass.js";
import { FXAAShader } from "https://cdn.jsdelivr.net/npm/three@0.139.2/examples/jsm/shaders/FXAAShader.js"


import Heart from "./components/GameObject/Joker/Heart.js";
import Coin from "./components/GameObject/Joker/Coin.js";
import FirePower from "./components/GameObject/Joker/FirePower.js";
import FireRate from "./components/GameObject/Joker/FireRate.js";
import Shield from "./components/GameObject/Joker/Shield.js";
import EnnemySpaceship from "./components/GameObject/EnnemySpaceship/EnnemySpaceship.js";
import Earth from "./components/GameObject/Planet/Earth.js";
import Sun from "./components/GameObject/Planet/Sun.js";
import Explosion from './components/GameObject/Explosion/Explosion.js';

import { _FS, _VS } from "./components/Shader/Earth/glslEarth.js";
import { _FSAT, _VSAT } from "./components/Shader/Earth/glslAtmosphere.js";
import { _FSBooster, _VSBooster } from "./components/Shader/Player/booster.js";
import { _FSSun, _VSSun } from "./components/Shader/Sun/glslSunShader.js";
import { _FSBloom, _VSBloom } from "./components/Shader/Postprocess/bloom.js";
import { _FSExplosion, _VSExplosion } from "./components/Shader/Explosion/explosion.js";
import { _FSBullet, _VSBullet } from "./components/Shader/Player/bullet.js";
import { vs_shader, fs_shader } from "./components/Shader/shield/glglShield.js"
import { getFBO } from "./components/Shader/FBO/FBO.js";
import SpecialBullet from './components/GameObject/Bullet/SpecialBullet.js';


class Asteroid {
    constructor() {

        this.Initialize();
        this.loadModel();
        this.loadAudio();

    }

    Initialize() {

        /*camera*/

        this.inGameCamera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 10000);
        this.inGameCamera.fov = 142.5
        this.inGameCamera.position.set(0, 0.4, 0.0);

        this.cameraStartMenu = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 2, 500);
        this.cameraStartMenu.position.set(5, 0, 15);
        this.cameraStartMenu.lookAt(new THREE.Vector3(-11, 0, 0));

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

        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });

        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(w, h);
        //this.renderer.toneMapping = THREE.ReinhardToneMapping;
        container.appendChild(this.renderer.domElement);

        /* post process */

        /*----- UnrealBloom Pass -----*/

        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        this.bloomPass.threshold = 0;
        this.bloomPass.exposure = 0.5;
        this.bloomPass.strength = 2;
        this.bloomPass.radius = 0.5;
        this.bloomComposer = new EffectComposer(this.renderer);
        this.bloomComposer.renderToScreen = false;

        this.finalPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                },
                vertexShader: _VSBloom(),
                fragmentShader: _FSBloom(),
                defines: {}
            }), 'baseTexture'
        );
        this.finalPass.needsSwap = true;
        this.finalComposer = new EffectComposer(this.renderer);

        /*----- Outline Pass -----*/

        this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.stageScene, this.inGameCamera);
        this.outlinePass.edgeStrength = 3;
        this.outlinePass.pulsePeriod = 4;
        this.outlinePass.edgeGlow = 0.076;
        this.outlinePass.edgeThickness = 1.35;
        this.outlinePass.visibleEdgeColor.set('#ffffff');
        this.outlinePass.hiddenEdgeColor.set('#190a05');
        /*----- FXAA Pass -----*/

        this.effectFXAA = new ShaderPass(FXAAShader);
        this.effectFXAA.name = "FXAAPass";
        this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);

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

        /*audio */
        // peut etre simplifié

        this.ambientListener = new THREE.AudioListener();
        this.ennemyLaserListener = new THREE.AudioListener();
        this.asteroidListener = new THREE.AudioListener();
        this.bulletListener = new THREE.AudioListener();
        this.shieldListener = new THREE.AudioListener();
        this.jokerListener = new THREE.AudioListener();
        this.plasmaListener = new THREE.AudioListener();
        this.playerDamageListener = new THREE.AudioListener();
        this.playerInstListener = new THREE.AudioListener();

        this.inGameCamera.add(this.ambientListener);
        this.inGameCamera.add(this.ennemyLaserListener)
        this.inGameCamera.add(this.asteroidListener);
        this.inGameCamera.add(this.bulletListener);
        this.inGameCamera.add(this.shieldListener);
        this.inGameCamera.add(this.jokerListener);
        this.inGameCamera.add(this.plasmaListener);
        this.inGameCamera.add(this.playerDamageListener);
        this.inGameCamera.add(this.playerInstListener);


        window.addEventListener('resize', () => {

            this.onWindowResize();

        }, false);

    }

    loadModel() {

        this.modelManager = [];
        this.animationsManager = [];
        this.idleAction = null;

        this.loaderType = {
            objLoader : new OBJLoader(this.loadingManager),
            fbxLoader : new FBXLoader(this.loadingManager),
        }

        /* 
        * texture
        */

        const textureLoader = new TextureLoader(this.loadingManager);

        var material = new THREE.MeshPhongMaterial({ map: textureLoader.load('../medias/models/textures/asteroid_diffuse.jpg') })
        var materialCoin = new THREE.MeshPhongMaterial({ map: textureLoader.load('../medias/models/collectable/coin/textures/Coin_Gold_albedo.png') });
        var materialEnnemySS = new THREE.MeshPhongMaterial({ map: textureLoader.load('../medias/models/Ennemy/textures/E-45 _col.jpg') });
        /* 
        *   Balle Joueur
        */


        const bulletPlayer = new THREE.Mesh(
            new THREE.CylinderGeometry(20, 20, 130),
            new THREE.MeshLambertMaterial({ color: 0xffff00, emissive: 0xffff00 }));
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
            this.specialBulletMaterial,
        )
        specialBulletMesh.name = "SpecialBulletItem";


        /* 
        *   Balle Ennemy
        */
        const cylinderMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(20, 20, 130),
            new THREE.MeshLambertMaterial({ color: 0xff0000, emissive: 0xff000d }));
        /* const geometryBullet = new THREE.CylinderBufferGeometry(0.01, 0.01, 0.1, 5, 1, false);*/
        cylinderMesh.name = "BulletEnnemy";
        cylinderMesh.rotateX((Math.PI / 180) * 90);

        /* 
        *   Item +1 Bullet
        */
        const firePowerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const firePowerMaterial = new THREE.MeshBasicMaterial({
            map: textureLoader.load("../medias/images/power-up/firepower.PNG"),
            color: 0xff0000
        });
        const firePower = new THREE.Mesh(firePowerGeometry, firePowerMaterial);
        firePower.name = "firePowerItem";

        /* 
        *   Cooldown fireRate
        */
        const fireRateGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const fireRateMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load("../medias/images/power-up/cooldown.png"), color: 0xEFDEDE });
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
                depthBuffer: { value: depth.texture },
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

        this.sunMaterial = new THREE.ShaderMaterial({
            vertexShader: _VSSun(),
            fragmentShader: _FSSun(),
            uniforms: {
                globeTexture: {
                    value: textureLoader.load("../medias/images/sun/sun.jpg"),

                },
                time: { // float initialized to 0
                    type: "f",
                    value: 0.0
                },
                growTime: {
                    type: "f",
                    value: 0.0
                },
                n: {
                    type: "f",
                    value: 0.0
                },
                intensity: {
                    type: "f",
                    value: 1.2
                },


            }

        });
        this.sunMaterial.parentName = "Sun";

        const sunMesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(5, 50, 50),
            this.sunMaterial,
        )
        sunMesh.rotateY((Math.PI / 180) * 280)
        sunMesh.name = "SunItem";

        /*
        * Star
        */

        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
        }
        )

        this.stars = new THREE.Points(starGeometry, starMaterial);

        /*
        * planet 
        */
        this.earthMaterial = new THREE.ShaderMaterial({
            vertexShader: _VS(),
            fragmentShader: _FS(),
            uniforms: {
                globeTexture: {
                    value: textureLoader.load("../medias/images/earth/earth2.jpg"),

                },

            }
        });
        this.earthMaterial.parentName = "Earth";

        const earthMesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(5, 50, 50),
            this.earthMaterial,
        )
        earthMesh.rotateY((Math.PI / 180) * 280)
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
            uniforms: {
                tExplosion: {
                    value: textureLoader.load("../medias/images/explosion/explosion.png"),

                },
                time: { // float initialized to 0
                    type: "f",
                    value: 0.0
                },
                growTime: {
                    type: "f",
                    value: 0.0
                },
                opacity: {
                    type: "f",
                    value: 1.0
                },
                weight: { type: "f", value: 10.0 }

            }

        })
        this.shaderExplosion.parentName = "Explosion";
        const explosion = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.5, 10),
            this.shaderExplosion,
        )

        explosion.name = "explosion";

        /*
        * Booster
        */

        this.booster = new THREE.Mesh(
            new THREE.SphereGeometry(0.005, 50, 50),
            new THREE.ShaderMaterial({
                vertexShader: _VSBooster(),
                fragmentShader: _FSBooster(),
                uniforms: {
                    time: { // float initialized to 0
                        type: "f",
                        value: 0.05
                    },
                    uniformZ: {
                        type: "f",
                        value: 0.5
                    },
                    uniformX: {
                        type: "f",
                        value: 0.7
                    },
                    boostPower: {
                        type: "f",
                        value: 0.03,
                    }
                },
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide

            })

        )
        this.booster.name = "booster";
        this.booster.position.set(0, -0.01, -0.155),
        this.booster.rotateY((Math.PI / 180) * 90);
       
        this.loaderModel(this.loaderType.fbxLoader, '../medias/models/test/SF_Fighter/SciFi_Fighter.FBX', "SpaceShip", null, (Math.PI / 180) * 70,false);
        this.loaderModel(this.loaderType.objLoader, '../medias/models/asteroid/Asteroid.obj', "SpaceRock",null,null,true);
        this.loaderModel(this.loaderType.objLoader, '../medias/models/Ennemy/ennemy_ss.obj',"EnnemySpaceship",materialEnnemySS, (Math.PI / 180) *180 ,true);
        this.loaderModel(this.loaderType.objLoader, "../medias/models/collectable/Love.obj","HeartItem",null,null,true);
        this.loaderModel(this.loaderType.objLoader, "../medias/models/collectable/coin/Coin.obj","CoinItem",materialCoin,null,true);

        this.modelManager.push(cylinderMesh); this.modelManager.push(firePower); this.modelManager.push(fireRate);
        this.modelManager.push(earthMesh); this.modelManager.push(bulletPlayer); this.modelManager.push(shieldMesh);
        this.modelManager.push(sunMesh); this.modelManager.push(explosion); this.modelManager.push(specialBulletMesh);

    }

    loaderModel(loaderType,path,name,material,rotation, traverse){
        switch (loaderType) { 
            case this.loaderType.fbxLoader:
                this.loaderType.fbxLoader.load(path,
                    (object) => {
                        object.name = name;
                        object.add(this.booster)
                        object.rotateY(rotation);
                        this.modelManager.push(object);
                    },
                    (xhr) => {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                    },
                    (error) => {
                        console.log(error);
                    }
                )
                break;
            case this.loaderType.objLoader:
                loaderType.load(path, (object) => {

                    if(!traverse){

                        object.name = name;
                        return; 

                    } 
                    
                    object.traverse(function (child) {
        
                        if (child.isMesh && material !== null) {
                            if (material) child.material = material;
                        };
        
                    });
                    console.log(rotation)
                    if(rotation !== null) object.children[0].rotateY( rotation );
                    object.name = name;
                    this.modelManager.push(object);

                });
                break;
        }
        
    }

    loadAudio() {

        this.audioManager = [];

        const audioLoader = new THREE.AudioLoader(this.loadingManager);
        
        this.addAudio('../medias/sounds/coin/coin.mp3',"Coin",audioLoader);
        this.addAudio('../medias/sounds/ennemyShip/laser-ennemy.mp3',"ennemyLaser",audioLoader);
        this.addAudio('../medias/sounds/bullet/plasma-pistol.mp3',"powerShot",audioLoader);
        this.addAudio("../medias/sounds/heart/heart.mp3","Heart",audioLoader);
        this.addAudio("../medias/sounds/bullet/bullet.wav","Bullet",audioLoader);
        this.addAudio("../medias/sounds/hit/hit.mp3","BulletHit",audioLoader);
        this.addAudio("../medias/sounds/ship/ship.mp3","ShipDamageTaken",audioLoader);
        this.addAudio("../medias/sounds/player/player-spawn.ogg","ShipRespawn",audioLoader);
        this.addAudio("../medias/sounds/item/item-pickup.wav","ItemPick",audioLoader);
        this.addAudio("../medias/sounds/shield/energy_shield.mp3","EnergyShield",audioLoader);
        this.addAudio("../medias/sounds/asteroid/asteroid_explosion.mp3","AsteroidExplosion",audioLoader);
        this.addAudio("../medias/sounds/startMenu/outer-wilds-timber-hearth.mp3","StartMenuTheme",audioLoader);
        this.addAudio("../medias/sounds/stage2/outer-wilds-dark-bramble.mp3","stage2-ambient",audioLoader);
        this.addAudio("../medias/sounds/stage1/outer-wilds-the-museum.mp3","stage1-ambient",audioLoader);
        this.addAudio("../medias/sounds/stage3/end-times.mp3","stage3-ambient",audioLoader);
        this.addAudio("../medias/sounds/stage3/outer-wilds-supernova.mp3","stage3-supernova",audioLoader);

    }

    addAudio(path,name,audioLoader){
        let me = this;

        audioLoader.load(path, function (buffer) {
            buffer.name = name;
            me.audioManager.push(buffer);
        });  
    }

    loadProps() {

        let playerModel, rockModel, heartModel, coinModel, ennemy_ssModel;
        let bulletEnnemy = new Object3D(); let bulletPlayer = new Object3D(); let firePowerModel = new Object3D();
        let fireRateModel = new Object3D(); let shieldModel = new Object3D(); let earthModel = new Object3D();
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

        const params = {

            goal: this.goal,
            camera: this.inGameCamera,
            follow: this.follow,

        }

        const gameAudio = {

            audioManager: this.audioManager,

            listener : {

                ambientListener: this.ambientListener,
                ennemyLaserListener: this.ennemyLaserListener,
                asteroidListener: this.asteroidListener,
                bulletListener: this.bulletListener,
                shieldListener: this.shieldListener,
                jokerListener: this.jokerListener,
                plasmaListener: this.plasmaListener,
                playerDamageListener: this.playerDamageListener,
                playerInstListener: this.playerInstListener
    
            },
    
            sound : {
    
                ambientSound : new THREE.Audio(this.ambientListener),
                ennemyLaserSound : new THREE.Audio(this.ennemyLaserListener),
                asteroidSound : new THREE.Audio(this.asteroidListener),
                bulletSound : new THREE.Audio(this.bulletListener),
                shieldSound :new THREE.Audio(this.shieldListener),
                jokerSound : new THREE.Audio(this.jokerListener),
                plasmaSound : new THREE.Audio(this.plasmaListener),
                playerDamageSound : new THREE.Audio(this.playerDamageListener),
                playerInstSound :new THREE.Audio(this.playerInstListener),
    
            }

        }  

        const gameTools = {

             utils : {

                renderer: this.renderer,
                stageScene: this.stageScene,
                sceneStartMenu: this.sceneStartMenu,
                inGameCamera: this.inGameCamera,
                startMenuCamera: this.cameraStartMenu,
                loop: this.loop,
                audio: this.audioManager
    
            },
    
             postProcess : {
    
                finalComposer: this.finalComposer,
                bloomComposer: this.bloomComposer,
    
                bloomPass: this.bloomPass,
                effectFXAA: this.effectFXAA,
                outlinePass: this.outlinePass,
                finalPass: this.finalPass,
    
            },
    
             shaders : {
    
                atmosphere: this.atmosphere,
                //  sunAtmosphere: this.sunAtmosphere,
                booster: this.booster,
                stars: this.stars,
    
                specialBullet: this.specialBulletMaterial,
                explosionShader: this.shaderExplosion,
                earthShader: this.earthMaterial,
                sunShader: this.sunMaterial,
                shieldShader: this.materialShield,
    
    
            }

        }

        const gameObjects = {

            player : new Player({ model : playerModel, audio: gameAudio, utils: params, name : "player"}),   
            ennemyShip : new EnnemySpaceship({ model : ennemy_ssModel, audio: gameAudio, utils: params, break : 0, name : "ennemySS"}),
            basicAsteroid : new BasicAsteroid({ model : rockModel, audio: gameAudio, utils: params, nbBreak : 0, name : "basicAsteroid"}),
            earth : new Earth({model : earthModel, audio: gameAudio, utils: params, break : 0, name : "earth"}),
            sun  : new Sun({model : sunModel, audio: gameAudio, utils: params, break : 0, name : "sun"}),
            basicBullet :  new BasicBullet({model : bulletPlayer, audio: gameAudio, utils: params, break : 0, name : "basicBullet"}),
            ennemyBullet :  new BasicBullet({model : bulletEnnemy, audio: gameAudio, utils: params, break : 0, name : "ennemyBullet"}),
            specialBullet : new SpecialBullet({model : specialeBullet, audio: gameAudio, utils: params, break : 0, name : "specialBullet"}),
            coin: new Coin({model : coinModel, audio: gameAudio, utils: params, break : 0, name : "coin"}),
            firepower : new FirePower({model : firePowerModel, audio: gameAudio, utils: params, break : 0, name : "firePower"}),
            firerate : new FireRate({model : fireRateModel, audio: gameAudio, utils: params, break : 0, name : "fireRate"}),
            shield : new Shield({model : shieldModel, audio: gameAudio, utils: params, break : 0, name : "shield"}),
            heart : new Heart({model : heartModel, audio: gameAudio, utils: params, break : 0, name : "heart"}),        
            explosion : new Explosion({model : explosionModel, audio: gameAudio, utils: params, break : 0, name : "explosion"}),

        }
        
        this.gameManager = new GameManager(gameObjects, gameTools, gameAudio);
        this.gameManager.ModelInitialisation();
        this.gameManager.ValueInitialisation();

        this.remove = null;

        document.addEventListener('keydown', this.remove = this.onPlayerBegin.bind(this))
        document.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);

    }

    onPlayerBegin(event) { // nom a changer

        if (event.code) {

            document.getElementById("start_game").style.display = "none";
            document.removeEventListener('keydown', this.remove);
            this.gameManager.state.start = true;

            this.gameManager.GetComponent("LevelSystem").scenePicker("StartMenu", true);

        }

    }

    onMouseWheel(event) {

        var fovMAX = 160;
        var fovMIN = 1;
        this.inGameCamera.fov -= event.wheelDeltaY * 0.05;
        this.inGameCamera.fov = Math.max(Math.min(this.inGameCamera.fov, fovMAX), fovMIN);
        this.inGameCamera.updateProjectionMatrix();
        console.log(this.inGameCamera)
    }

    onWindowResize() {

        this.inGameCamera.aspect = window.innerWidth / window.innerHeight;
        this.inGameCamera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.bloomComposer.setSize(window.innerWidth, window.innerHeight);
        this.finalComposer.setSize(window.innerWidth, window.innerHeight);

    }

    onTransitionEnd(event) {

        event.target.remove();
        this.loadProps();

    }

}
let _App = new Asteroid();


