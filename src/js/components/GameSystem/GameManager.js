import DisplaySystem from "./DisplaySystem.js";
import JokerSystem from "./JokerSystem.js";
import LevelSystem from "./LevelSystem.js";
import GameObjectManager from "./gameObjectManager.js";
import HackSystem from "./HackSystem.js";
import SoundSystem from "./SoundSystem.js";
import MenuSystem from "./MenuSystem.js";
import SceneSystem from "./SceneManager.js";


class GameManager {

    constructor(models, utils, animation, audio, shaders) {

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

        /*
        * Anim
        */
        this.mixer = animation.mixer;
        this.idle = animation.idleAction;


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

        this.asteroid.InitMesh();
        this.player.InitMesh();
        this.ennemy_ss.InitMesh();
        this.heart.InitMesh();
        this.coin.InitMesh();
        this.earth.InitMesh();
        this.firepower.InitMesh();
        this.firerate.InitMesh();
        this.shield.InitMesh();
        this.basicBullet.InitMesh();
        this.ennemyBullet.InitMesh();

    }

    ValueInitialisation() {

        this.player.GetComponent("PlayerShootProjectiles").weaponParams = this.basicBullet;
        this.player.GetComponent("PlayerCameraSystem").limit = this.limit;
        this.player.stageSystem = this.GetComponent("LevelSystem");
        this.player.audio_syst = this.GetComponent("SoundSystem");
        this.player.add(this.booster);

        console.log(this.player.children)
        
        this.input = this.player.GetComponent("CharacterControllerInput").keys;

        this.ennemy_ss.weaponParams = this.ennemyBullet;
        this.ennemy_ss.asteroid = this.asteroid;
        this.ennemy_ss.target = this.player;

        this.ennemyBullet.name = "EnnemyBullet";


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


                this.renderer.render(this.currentScene, this.currentCamera);


            }

            
            this.loop.last = this.loop.now;
            this.Step(this.tempTime);

        } else {

            this.prevTime = null;

        }



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