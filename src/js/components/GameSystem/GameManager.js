import { _FSBloom, _VSBloom}  from "../../components/Shader/bloom.js"

import * as THREE from 'three';
import { _FS,_VS } from "../Planet/glslEarth.js";

import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.139/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.139/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "https://cdn.jsdelivr.net/npm/three@0.139/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass  } from "https://cdn.jsdelivr.net/npm/three@0.139/examples/jsm/postprocessing/UnrealBloomPass.js";

import DisplaySystem from "./DisplaySystem.js";
import JokerSystem from "./JokerSystem.js";
import LevelSystem from "./LevelSystem.js";
import GameObjectManager from "./gameObjectManager.js";
import HackSystem from "./HackSystem.js";
import SoundSystem from "./SoundSystem.js";
import MenuSystem from "./MenuSystem.js";
import SceneSystem from "./SceneManager.js";
import { Object3D, TextureLoader } from '../../three/three.module.js';


class GameManager {

    constructor(models, utils, audio, shaders, postProcess) {

        this.components = {};
        this.currentScene = new THREE.Scene();
        this.currentCamera = new THREE.Camera();


        /*
        * Utils
        */
        this.composer = utils.composer;
        this.renderer = utils.renderer;
        this.currentScene = utils.scene;
        
        this.inGameCamera = utils.inGameCamera;
        this.startMenuCamera = utils.startMenuCamera;
        this.loop = utils.loop;

        /*
        * Models
        */
        this.models = models;
        this.player = models.player;
        this.asteroid = models.asteroid;
        this.heart = models.heart;
        this.coin = models.coin;
        this.earth = models.earth;
        this.sun = models.sun;
        this.firepower = models.firepower;
        this.firerate = models.firerate;
        this.shield = models.shield;
        this.basicBullet = models.basicBullet;
        this.ennemyBullet = models.ennemyBullet;
        this.ennemy_ss = models.ennemy_ss;

        /*
        * Audio
        */
        this.audio = audio;

        /*
        * Shader
        */

        this.atmosphere = shaders.astmosphere;
        this.booster = shaders.booster;
        this.sunAtmosphere = shaders.sunAtmosphere;
        this.stars = shaders.stars;

        /*
        * PostProcess
        */
        this.materials = {},
        this.bloomLayer = postProcess.bloomLayer;
       /* this.finalComposer = postProcess.finalComposer;
        this.bloomComposer = postProcess.finalComposer;

        this.bloomPass = postProcess.bloomPass,
        this.finalPass = postProcess.finalPass,*/


        /*
        * GM
        */
        this.limit = 10;
        this.limit_background = 40;
        this.score = 0;
        this.playerLife = 1;
        this.ennemyRemaining = null;
        this.input = null;

        /*
        * Timer
        */
        this.timeElapsed = 0;
        this.prevTime = 0;
        this.seconds = 0;
        this.stopWatchInterval;
        /*
        * Global Key
        */

        this.state = {

            start: false,
            pause: false,
            keyboard: false,
            postProcess:false,
        };

        document.addEventListener('keydown', (e) => this.OnKeyDown(e), false);

        this.InitComponent(models, audio);

    }

    InitComponent(models, audio) {


        this.AddComponent(new LevelSystem(this));
        this.AddComponent(new SoundSystem(this, this.audio));
        this.AddComponent(new JokerSystem(this, models));
        this.AddComponent(new DisplaySystem(this));
        this.AddComponent(new HackSystem(this));
        this.AddComponent(new GameObjectManager(this));
        this.AddComponent(new MenuSystem(this));
        this.AddComponent(new SceneSystem(this));

    }

    AddComponent(c) {

        this.components[c.constructor.name] = c;

    }

    RemoveComponent(c) {

        delete this.components[c];  

    }

    GetComponent(n) {

        return this.components[n];

    }

    ModelInitialisation() {

        // boucle for Each plus tard
        this.asteroid.InitMesh();
        this.player.InitMesh();
        this.ennemy_ss.InitMesh();
        this.heart.InitMesh();
        this.coin.InitMesh();
        this.earth.InitMesh();
        this.sun.InitMesh();
        this.firepower.InitMesh();
        this.firerate.InitMesh();
        this.shield.InitMesh();
        this.basicBullet.InitMesh();
        this.ennemyBullet.InitMesh();

    }

    ValueInitialisation() {

        /* Player init */
        this.player.GetComponent("PlayerShootProjectiles").weaponParams = this.basicBullet;
        this.player.GetComponent("PlayerCameraSystem").limit = this.limit;

        this.player.stageSystem = this.GetComponent("LevelSystem");
        this.player.audio_syst = this.GetComponent("SoundSystem");

        this.player.add(this.booster);
       
        const booster = this.player.children.find( e =>e.name =="booster"  )

        booster.position.set(0,-0.01,-0.15)
        
        /* ---- */
        this.input = this.player.GetComponent("CharacterControllerInput").keys;

        this.ennemy_ss.weaponParams = this.ennemyBullet;
        this.ennemy_ss.asteroid = this.asteroid;
        this.ennemy_ss.target = this.player;

        this.ennemyBullet.name = "EnnemyBullet";


    }

    PostProcessRender(){

        const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold =0;
        bloomPass.exposure =1;
		bloomPass.strength = 5;
		bloomPass.radius =1;

        const renderScene = new RenderPass( this.currentScene, this.currentCamera );
        
        this.bloomComposer  = new EffectComposer(this.renderer);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass( renderScene );
		this.bloomComposer.addPass( bloomPass );

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

        this.finalComposer.addPass( renderScene );
        this.finalComposer.addPass( this.finalPass );



    }

    OnPlayerEnd() {

        this.state.pause = true;
        this.GetComponent("DisplaySystem").printDeath(this.score);

    }

    StageCompleted() {//level system

        this.state.pause = true;
        this.GetComponent("DisplaySystem").printStageCompleted(this.score);//a regler le score arrive avant

    }

    OnKeyDown(event) {

        switch (event.keyCode) {

            case 27:

                if (!this.state.pause) {

                    this.state.pause = true;
                    this.GetComponent("DisplaySystem").printPause();

                } else {

                    this.state.pause = false;
                    this.GetComponent("DisplaySystem").printUIHeader(this.player.life, this.score);

                }

                break;
            case 72:
                if (!this.state.keyboard) {

                    this.state.keyboard = true;
                    this.state.pause = true;
                    this.GetComponent("DisplaySystem").printKeyboardShortcut();

                } else {

                    this.state.keyboard = false;
                    this.state.pause = false;
                    this.GetComponent("DisplaySystem").printUIHeader(this.player.life, this.score);

                }

                break;

        }

    }


    RAF() {
        
        requestAnimationFrame(this.RAF.bind(this));

        if (!this.state.pause) {

            this.loop.now = window.performance.now();
            this.loop.dt = this.loop.dt + Math.min(1, (this.loop.now - this.loop.last) / 1000);

            while (this.loop.dt > this.loop.slowStep) this.loop.dt = this.loop.dt - this.loop.slowStep;
            this.prevTime = Date.now() - this.loop.slowStep;
            this.timeElapsed += Date.now() - this.prevTime;
            this.tempTime = this.timeElapsed;
            if(this.state.postProcess){

                //this.composer.render(this.tempTime);

            }else{


				//this.bloomComposer.render();

				//this.finalComposer.render();
               
               // this.currentCamera.layers.set(0);
               this.renderBloom();
              //  this.currentCamera.layers.set(0);
                 this.finalComposer.render();
              //  this.renderer.render(this.currentScene, this.currentCamera);


            }
 
            this.loop.last = this.loop.now;
            this.Step(this.tempTime);

        } else {

            this.prevTime = null;

        }

    }

    renderBloom( ) {

        let that = this;

        this.currentScene.traverse( function(child ) {
          
            if(!child.isMesh || child.name == "SunItem" || child.name == "EarthItem")  return;
            
            that.materials[child.uuid] = child.material;
            child.material = new THREE.MeshBasicMaterial( { color: 'black' } );   
         

        },true)

        console.log(`---------------------------------------------------`);
        this.bloomComposer.render();

        this.currentScene.traverse( function(child ) {

            if(!child.isMesh || child.name == "SunItem" || child.name == "EarthItem")  return;
            
            child.material = that.materials[ child.uuid ];
            delete that.materials[ child.parent.uuid ];

        },true)


    }

    Step(timeElapsed) {

        for (let k in this.components) {
            this.components[k].Update(timeElapsed * 0.001);

        }

        if (this.player.GetComponent("CharacterControllerInput").keys.screenshot) {
            this.player.GetComponent("CharacterControllerInput").keys.screenshot = false;

            html2canvas(document.querySelector("canvas")).then(function (canvas) {

                var win = window.open();
                win.document.write('<iframe src="' + canvas.toDataURL("png") + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen> </iframe>');

            })

        }

    }

}

export default GameManager