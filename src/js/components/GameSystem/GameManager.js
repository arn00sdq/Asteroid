import * as THREE from 'three';

import { _FS, _VS } from "../Shader/Earth/glslEarth.js";
import { _FSBloom, _VSBloom } from "../Shader/Postprocess/bloom.js"

import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.139/examples/jsm/postprocessing/RenderPass.js";
import Stats from "https://cdn.jsdelivr.net/npm/three@0.139.2/examples/jsm/libs/stats.module.js"
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.139.2/examples/jsm/controls/OrbitControls.js"


import DisplaySystem from "./DisplaySystem.js";
import JokerSystem from "./JokerSystem.js";
import LevelSystem from "./LevelSystem.js";
import GameObjectManager from "./gameObjectManager.js";
import HackSystem from "./HackSystem.js";
import SoundSystem from "./SoundSystem.js";
import MenuSystem from "./MenuSystem.js";

class GameManager {

    constructor(gameObject, gameTools, gameAudio) {

        this.components = {};

        this.gameModels  = gameObject;
        this.gameAudio = gameAudio;
        
        this.shaders = gameTools.shaders;
        this.postProcess = gameTools.postProcess;
        this.utils = gameTools.utils,

        this.currentScene = new THREE.Scene();
        this.currentCamera = new THREE.Camera();

        this.materials = {};
        this.selectedObjects = [];
        this.selectedEnnemy = [];
        this.postProActive = true;

        this.stat = false;
        this.targetStat = new Stats();

        this.mixer = null;

        /*
        * GM
        */
        this.limit = 10;
        this.limit_background = 40;
        this.score = 0;
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

        this.InitComponent();

    }

    AddAudioComponent(name, audio) {

        this.audio[name] = audio;

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

    InitComponent() {

        this.AddComponent(new SoundSystem(this));
        this.AddComponent(new LevelSystem(this));
        this.AddComponent(new DisplaySystem(this));
        this.AddComponent(new JokerSystem(this, this.gameModels));
        this.AddComponent(new HackSystem(this, this.gameAudio));
        this.AddComponent(new GameObjectManager(this, this.gameAudio));
        this.AddComponent(new MenuSystem(this));

    }

    ModelInitialisation() {

        for (const [key, values] of Object.entries(this.gameModels)) {

            values.sceneManager = this;
            values.InitMesh();
            values.InitValue();
        }

    }

    ValueInitialisation() {

        this.input = this.gameModels.player.GetComponent("CharacterControllerInput").keys;
        this.gameModels.ennemyBullet.name = "EnnemyBullet";

    }

    PostProcessRender(switchScene) {

        let containRenderPass1 = false; let containRenderPass2 = false; let containBloom = false; let containOutline = false; let containFXAA = false;
        let pass = this.GetComponent("MenuSystem").video;
        const renderScene = new RenderPass(this.currentScene, this.currentCamera);

        this.postProcess.bloomComposer.passes.forEach(e => { if (e.constructor.name == "RenderPass") containRenderPass1 = true })
        this.postProcess.finalComposer.passes.forEach(e => { if (e.constructor.name == "RenderPass") containRenderPass2 = true })

        this.postProcess.bloomComposer.passes.forEach(e => { if (e.constructor.name == "UnrealBloomPass") containBloom = true })
        this.postProcess.finalComposer.passes.forEach(e => { if (e.constructor.name == "OutlinePass") containOutline = true })
        this.postProcess.finalComposer.passes.forEach(e => { if (e.name == "FXAAPass") containFXAA = true })

        if (!containRenderPass1) this.postProcess.bloomComposer.addPass(renderScene);
        if (!containRenderPass2) this.postProcess.finalComposer.addPass(renderScene);

        if (switchScene) {

            this.postProcess.bloomComposer.passes.shift();
            this.postProcess.bloomComposer.insertPass(renderScene, 0);

            this.postProcess.finalComposer.passes.shift();
            this.postProcess.finalComposer.insertPass(renderScene, 0);

        }

        if (pass.bloom == false && containBloom) {

            this.postProcess.bloomComposer.removePass(this.postProcess.bloomPass);
            this.postProcess.finalComposer.removePass(this.postProcess.finalPass);

        }
        if (pass.bloom == true && !containBloom) {

            this.postProcess.bloomComposer.addPass(this.postProcess.bloomPass);
            this.postProcess.finalComposer.addPass(this.postProcess.finalPass);

        }

        if (pass.outline == false && containOutline) this.postProcess.finalComposer.removePass(this.postProcess.outlinePass);
        if (pass.outline == true && !containOutline) this.postProcess.finalComposer.addPass(this.postProcess.outlinePass);

        if (pass.fxaa == false && containFXAA) this.postProcess.finalComposer.removePass(this.postProcess.effectFXAA);
        if (pass.fxaa == true && !containFXAA) this.postProcess.finalComposer.addPass(this.postProcess.effectFXAA);

        // 

    }

    OnPlayerEnd() {

        this.state.pause = true;
        this.GetComponent("DisplaySystem").printDeath(this.score);

    }

    StageCompleted(level) {

        this.state.pause = true;
        if (level == "Stage3") {

            this.GetComponent("DisplaySystem").printVictory(this.score);

        } else {

            this.GetComponent("DisplaySystem").printStageCompleted(this.score);//a regler le score arrive avant

        }


    }


    RAF() {

        requestAnimationFrame(this.RAF.bind(this));
        if (!this.state.pause) {
            //this.controls.update()
            this.utils.loop.now = window.performance.now();
            this.utils.loop.dt = this.utils.loop.dt + Math.min(1, (this.utils.loop.now - this.utils.loop.last) / 1000);
            while (this.utils.loop.dt > this.utils.loop.slowStep) this.utils.loop.dt = this.utils.loop.dt - this.utils.loop.slowStep;
            this.prevTime = Date.now() - this.utils.loop.slowStep;
            this.timeElapsed += Date.now() - this.prevTime;
            this.tempTime = this.timeElapsed;

            if (this.postProActive) {

                this.renderBloom();
                this.postProcess.outlinePass.selectedObjects = this.selectedObjects;
                this.postProcess.finalComposer.render();


            } else {

                this.utils.renderer.render(this.currentScene, this.currentCamera)

            }

            if (this.mixer !== null) this.mixer.update(this.utils.loop.dt * 5)

            this.targetStat.update()

            this.utils.loop.last = this.utils.loop.now;
            this.Step(this.utils.loop.dt, this.tempTime);

        } else {

            this.prevTime = null;

        }


    }

    renderBloom() {

        let that = this;
        
        this.currentScene.traverse(function (child) {

            if ((!child.isMesh && child.constructor.name !== "Points") || child.name == "SunItem" || child.name == "EarthItem") return;

            that.materials[child.uuid] = child.material;

            child.material = new THREE.MeshBasicMaterial({ color: 'black' });


        }, true)

        this.postProcess.bloomComposer.render();

        this.currentScene.traverse(function (child) {

            if ((!child.isMesh && child.constructor.name !== "Points") || child.name == "SunItem" || child.name == "EarthItem") return;

            child.material = that.materials[child.uuid];
            delete that.materials[child.parent.uuid];

        }, true)


    }

    Step(timeElapsed, timeInSecond) {

        for (let k in this.components) {

            this.components[k].Update(timeElapsed, timeInSecond * 0.001);

        }

        if (this.gameModels.player.GetComponent("CharacterControllerInput").keys.screenshot) {
            this.gameModels.player.GetComponent("CharacterControllerInput").keys.screenshot = false;

            html2canvas(document.querySelector("body")).then(function (canvas) {

                var win = window.open();
                win.document.write('<iframe src="' + canvas.toDataURL("png") + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen> </iframe>');

            })

        }

    }

}

export default GameManager