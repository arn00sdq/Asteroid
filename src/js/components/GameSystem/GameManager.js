import DisplaySystem from "./DisplaySystem.js";
import JokerSystem from "./JokerSystem.js";
import LevelSystem from "./LevelSystem.js";
import GameObjectManager from "./gameObjectManager.js";
import HackSystem from "./HackSystem.js";
import SoundSystem from "./SoundSystem.js";


class GameManager {

    constructor(models, utils, animation,audio, particule){

        this.components = {};

        /*
        * Utils
        */
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
        this.ennemy = null;
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

        this.Globalkey = {
      
            pause: false,
            restart: false,
            next: false,
            video: false,
            audio: false,
            quit: false,
      
          };

        document.addEventListener('keydown', (e) => this.OnKeyDown(e), false);
        document.addEventListener('click', (e) => this.OnClick(e), false);

        this.InitComponent(models,audio);

    }

    InitComponent(models,audio){

        
        this.AddComponent(new LevelSystem(this));
        this.AddComponent(new SoundSystem(this,this.audio));
        this.AddComponent(new JokerSystem(this,models));
        this.AddComponent(new DisplaySystem(this));
        this.AddComponent(new HackSystem(this));
        this.AddComponent(new GameObjectManager(this));
        
    }

    AddComponent(c) {

        this.components[c.constructor.name] = c;   

    }

    GetComponent(n) {

        return this.components[n];

    }

    ModelInitialisation(){

        this.asteroid.InitMesh(new THREE.Vector3(1,1,1));
        this.player.InitMesh(new THREE.Vector3(1,1,1));
        this.ennemy_ss.InitMesh(new THREE.Vector3(1,1,1));
        this.heart.InitMesh(new THREE.Vector3(1,1,1));
        this.coin.InitMesh(new THREE.Vector3(1,1,1));
        this.arrow.InitMesh(new THREE.Vector3(1,1,1));
        this.shield.InitMesh(new THREE.Vector3(1,1,1));
        this.basicBullet.InitMesh(new THREE.Vector3(1,1,1));
        this.ennemyBullet.InitMesh(new THREE.Vector3(1,1,1));

    }

    ValueInitialisation(){

        this.player.GetComponent("PlayerShootProjectiles").weaponParams = this.basicBullet;
        this.player.audio_syst = this.GetComponent("SoundSystem");
        this.input = this.player.GetComponent("CharacterControllerInput").keys;

        this.ennemy_ss.weaponParams = this.ennemyBullet;
        this.ennemy_ss.asteroid = this.asteroid;
        this.ennemy_ss.target = this.player;

        this.ennemyBullet.name = "EnnemyBullet";


    }

    OnPlayerEnd() {

        this.Globalkey.pause = true;
        this.GetComponent("DisplaySystem").printDeath(this.score);

    }

    StageCompleted(){

        this.Globalkey.pause = true;
        this.GetComponent("DisplaySystem").printStageCompleted(this.score);

    }

    OnKeyDown(event) {

        switch (event.keyCode) {
    
          case 27:
    
            if(!this.Globalkey.pause){
    
              this.Globalkey.pause = true;
              this.GetComponent("DisplaySystem").printPause();
    
            }else{
    
              this.Globalkey.pause = false;
              this.GetComponent("DisplaySystem").printUIHeader(this.player.life,this.score);
    
            }
            
            break;
        }

    }

    OnClick(event){
        console.log(event.target.id)
        switch(event.target.id){

            case "resume":
                this.Globalkey.pause = false;
                this.GetComponent("DisplaySystem").printUIHeader(this.player.life,this.score); 
                break;
            case "restart":
                this.ResetLevel();
                this.GetComponent("LevelSystem").StartLevel(this.GetComponent("LevelSystem").currentLevel, false);
                break;
            case "next":
                this.ResetLevel();
                let currentLevel = this.GetComponent("LevelSystem").currentLevel + 1;
                this.GetComponent("LevelSystem").StartLevel(currentLevel, false);
                break;
            case "audio":
                break;
            case "video":
                break;
            case "quit":
                document.location.href = "index.html";
                break;
            default:
                break;

        }

    }

    ResetLevel(){

        this.Globalkey.pause = true;
        this.timeElapsed = 0;
        this.score = 0;

        this.player.ResetPlayer();

        this.RemoveProps();

        this.GetComponent("DisplaySystem").printUIHeader(1,0);

    }

    RemoveProps(){

        var to_remove = [];

        this.scene.traverse ( function( child ) {
            if ( ( child.type == "Object3D")  && !child.userData.keepMe === true ) {
                to_remove.push( child );
            }
        } );

        for ( var i = 0; i < to_remove.length; i++ ) {
            this.scene.remove( to_remove[i] );
        }

    }

    RAF() {

            if(!this.Globalkey.pause){

                this.loop.now = window.performance.now();
                this.loop.dt = this.loop.dt + Math.min(1, (this.loop.now - this.loop.last) / 1000);

                while(this.loop.dt > this.loop.slowStep) this.loop.dt = this.loop.dt - this.loop.slowStep;

                this.prevTime = Date.now() - this.loop.slowStep;
                this.timeElapsed += Date.now() - this.prevTime;
                this.tempTime = this.timeElapsed;
                this.renderer.render(this.scene, this.camera);
                this.loop.last = this.loop.now;
                this.Step(this.tempTime);

            }else{
                
                
                this.prevTime = null;

            }
    
            requestAnimationFrame(this.RAF.bind(this));

      }
    
    Step(timeElapsed) {  

        for (let k in this.components) {

            this.components[k].Update(timeElapsed * 0.001);

        }

        if (this.player.GetComponent("CharacterControllerInput").keys.screenshot) {
            this.player.GetComponent("CharacterControllerInput").keys.screenshot = false;

            html2canvas(document.querySelector("canvas")).then(function (canvas){

                var win = window.open();
                win.document.write('<iframe src="' + canvas.toDataURL("png")  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen> </iframe>');
            
            })
              
        }

    }

}

export default GameManager