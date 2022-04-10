import * as THREE from 'three';

import { _FS,_VS } from "../Shader/Earth/glslEarth.js";
import { _FSBloom, _VSBloom}  from "../Shader/Postprocess/bloom.js"

import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.139/examples/jsm/postprocessing/RenderPass.js";

import DisplaySystem from "./DisplaySystem.js";
import JokerSystem from "./JokerSystem.js";
import LevelSystem from "./LevelSystem.js";
import GameObjectManager from "./gameObjectManager.js";
import HackSystem from "./HackSystem.js";
import SoundSystem from "./SoundSystem.js";
import MenuSystem from "./MenuSystem.js";
import SceneSystem from "./SceneManager.js";

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
        this.stageScene = utils.stageScene;

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
        this.explosion = models.explosion;

        /*
        * Audio
        */
        this.audio = audio;

        /*
        * Shader
        */

        this.shaders = shaders;
        this.atmosphere = shaders.astmosphere;
        this.booster = shaders.booster;
        this.sunAtmosphere = shaders.sunAtmosphere;
        this.stars = shaders.stars;
        this.explosionShader = shaders.explosionShader;
        this.earthShader = shaders.earthShader
        
        /*
        * PostProcess
        */
        this.materials = {};
        this.selectedObjects = [];
        this.selectedEnnemy = [];
        this.postProActive = true;

        this.finalComposer = postProcess.finalComposer;
        this.bloomComposer = postProcess.bloomComposer;

        this.effectFXAA = postProcess.effectFXAA,
        this.outlinePass = postProcess.outlinePass,
        this.bloomPass = postProcess.bloomPass,
        this.finalPass = postProcess.finalPass,

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
        * Global 
        */

        this.state = {

            start: false,
            pause: false,
            keyboard: false,

        };

        this.InitComponent(models, audio);

    }

    InitComponent(models, audio) {


        this.AddComponent(new LevelSystem(this));
        this.AddComponent(new SoundSystem(this, audio));
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

        for(const [key,values] of Object.entries(this.models)){

            values.InitMesh();
            /*console.log(this.audio.listener.context)
            const sound = new THREE.Audio( this.audio.listener );*/
            
    
        } 

        console.log(this.models)

    }

    ValueInitialisation() {

        /* Player init */
        this.player.GetComponent("PlayerShootProjectiles").weaponParams = this.basicBullet;
        this.player.GetComponent("PlayerCameraSystem").limit = this.limit;
        this.player.stageSystem = this.GetComponent("LevelSystem");
        this.player.audio_syst = this.GetComponent("SoundSystem");
        this.player.add(this.booster);
       
        /* EnnemyShip init */
        
        this.ennemy_ss.stageSystem = this.GetComponent("LevelSystem");
        this.ennemy_ss.audio_syst = this.GetComponent("SoundSystem");
        this.ennemy_ss.weaponParams = this.ennemyBullet;
        this.ennemy_ss.asteroid = this.asteroid;
        this.ennemy_ss.target = this.player;

        const booster = this.player.children.find( e =>e.name =="booster"  )
        booster.position.set(0,-0.01,-0.155)
        
        this.input = this.player.GetComponent("CharacterControllerInput").keys;

        this.ennemyBullet.name = "EnnemyBullet";

    }

    PostProcessRender(switchScene){

        let containRenderPass1 = false; let containRenderPass2 = false; let containBloom = false; let containOutline = false; let containFXAA = false;
        let pass = this.GetComponent("MenuSystem").video;
        const renderScene = new RenderPass( this.currentScene, this.currentCamera ); 

        this.bloomComposer.passes.forEach( e => { if (e.constructor.name == "RenderPass") containRenderPass1 = true})
        this.finalComposer.passes.forEach( e => { if (e.constructor.name == "RenderPass") containRenderPass2 = true})

        this.bloomComposer.passes.forEach( e => { if (e.constructor.name == "UnrealBloomPass") containBloom = true })
        this.finalComposer.passes.forEach( e => { if (e.constructor.name == "OutlinePass") containOutline = true })
        this.finalComposer.passes.forEach( e => { if (e.name == "FXAAPass") containFXAA = true })
        
        if (!containRenderPass1) this.bloomComposer.addPass(renderScene);
        if (!containRenderPass2) this.finalComposer.addPass(renderScene);

        if(switchScene){

            this.bloomComposer.passes.shift();
            this.bloomComposer.insertPass(renderScene, 0);

            this.finalComposer.passes.shift();
            this.finalComposer.insertPass(renderScene, 0);

            console.log(this.finalComposer)

        }

        if (pass.bloom == false && containBloom){

            this.bloomComposer.removePass(this.bloomPass);
            this.finalComposer.removePass(this.finalPass);

        } 
        if (pass.bloom == true && !containBloom ){

            this.bloomComposer.addPass(this.bloomPass);
            this.finalComposer.addPass(this.finalPass);

        } 

        if (pass.outline == false && containOutline) this.finalComposer.removePass(this.outlinePass);
        if (pass.outline == true && !containOutline) this.finalComposer.addPass(this.outlinePass);     

        if (pass.fxaa == false && containFXAA) this.finalComposer.removePass(this.effectFXAA);
        if (pass.fxaa == true && !containFXAA) this.finalComposer.addPass(this.effectFXAA);    

        console.log(this.currentScene.children)

    }

    OnPlayerEnd() {

        this.state.pause = true;
        this.GetComponent("DisplaySystem").printDeath(this.score);

    }

    StageCompleted() {

        this.state.pause = true;
        this.GetComponent("DisplaySystem").printStageCompleted(this.score);//a regler le score arrive avant

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
            if(this.postProActive){

              /*  this.renderBloom();
                this.outlinePass.selectedObjects = this.selectedObjects;
                this.finalComposer.render();*/
                this.renderer.render(this.currentScene,this.currentCamera)

            }else{
               
               this.renderer.render(this.currentScene,this.currentCamera)

            }
 
            this.loop.last = this.loop.now;
            this.Step(this.loop.dt,this.tempTime);

        } else {

            this.prevTime = null;

        }
        

    }

    renderBloom( ) {

        let that = this;

        this.currentScene.traverse( function(child ) {
          
            if( (!child.isMesh && child.constructor.name !== "Points") || child.name == "SunItem" || child.name == "EarthItem")  return;
            
            that.materials[child.uuid] = child.material;
            
            child.material = new THREE.MeshBasicMaterial( { color: 'black' } );   
         

        },true)

        this.bloomComposer.render();
       
        this.currentScene.traverse( function(child ) {

            if((!child.isMesh && child.constructor.name !== "Points")  || child.name == "SunItem" || child.name == "EarthItem")  return;
            
            child.material = that.materials[ child.uuid ];
            delete that.materials[ child.parent.uuid ];

        },true)


    }

    Step(timeElapsed,timeInSecond) {

        for (let k in this.components) {
            this.components[k].Update(timeElapsed,timeInSecond * 0.001);

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