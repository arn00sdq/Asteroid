import DisplaySystem from "./DisplaySystem.js";
import JokerSystem from "./JokerSystem.js";
import LevelSystem from "./LevelSystem.js";
import GameObjectManager from "./gameObjectManager.js";
import HackSystem from "./HackSystem.js";
import SoundSystem from "./SoundSystem.js";
import MenuSystem from "./MenuSystem.js";


class GameManager {

    constructor(models, utils, animation, audio, particule) {

        this.components = {};

        /*
        * Utils
        */
        this.composer = utils.composer;
        this.renderer = utils.renderer;
        this.scene = utils.scene;
        this.camera = utils.camera;
        this.loop = utils.loop;

        /*
        * Models
        */
        this.player = models.player;
        this.asteroid = models.asteroid;
        this.heart = models.heart;
        this.coin = models.coin;
        this.arrow = models.arrow;
        this.shield = models.shield;
        this.basicBullet = models.basicBullet;
        this.ennemyBullet = models.ennemyBullet;
        this.ennemy_ss = models.ennemy_ss;

        /*
        * Audio
        */
        this.audio = audio

        /*
        * Anim
        */
        this.mixer = animation.mixer;
        this.idle = animation.idleAction;

        /*
        * Anim
        */

        this.particuleExplosion = particule.particuleExplosion;

        /*
        * GM
        */
        this.limit = 10;
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

    }

    AddComponent(c) {

        this.components[c.constructor.name] = c;

    }

    GetComponent(n) {

        return this.components[n];

    }

    ModelInitialisation() {

        this.asteroid.InitMesh(new THREE.Vector3(1, 1, 1));
        this.player.InitMesh(new THREE.Vector3(1, 1, 1));
        this.ennemy_ss.InitMesh(new THREE.Vector3(1, 1, 1));
        this.heart.InitMesh(new THREE.Vector3(1, 1, 1));
        this.coin.InitMesh(new THREE.Vector3(1, 1, 1));
        this.arrow.InitMesh(new THREE.Vector3(1, 1, 1));
        this.shield.InitMesh(new THREE.Vector3(1, 1, 1));
        this.basicBullet.InitMesh(new THREE.Vector3(1, 1, 1));
        this.ennemyBullet.InitMesh(new THREE.Vector3(1, 1, 1));

    }

    ValueInitialisation() {

        this.player.GetComponent("PlayerShootProjectiles").weaponParams = this.basicBullet;
        this.player.audio_syst = this.GetComponent("SoundSystem");
        this.player.GetComponent("PlayerCameraSystem").limit = this.limit;

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

    StageCompleted() {

        this.state.pause = true;
        this.GetComponent("DisplaySystem").printStageCompleted(this.score);//a regler le score arrive avant

    }

    ResetLevel() {

        this.state.pause = true;
        this.timeElapsed = 0;
        this.score = 0;

        this.player.ResetPlayer();

        this.RemoveProps();

        this.GetComponent("DisplaySystem").printUIHeader(1, 0);

    }

    RemoveProps() {

        var to_remove = [];

        this.scene.traverse(function (child) {
            if ((child.type == "Object3D") && !child.userData.keepMe === true) {
                to_remove.push(child);
            }
        });

        for (var i = 0; i < to_remove.length; i++) {
            this.scene.remove(to_remove[i]);
        }

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

                this.renderer.render(this.scene, this.camera);

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