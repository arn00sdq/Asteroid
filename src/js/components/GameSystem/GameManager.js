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

        this.Globalkey = {
            
            start: false,
            pause: false,
            keyboard: false,
            restart: false,
            next: false,
            video: false,
            audio: false,
            quit: false,
      
          };

        document.addEventListener('keydown', (e) => this.OnKeyDown(e), false);
        document.addEventListener('click', (e) => this.OnClick(e), false);
        document.addEventListener("change", (e) => this.OnChange(e), false);

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
        this.player.GetComponent("PlayerCameraSystem").limit = this.limit;

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
        this.GetComponent("DisplaySystem").printStageCompleted(this.score);//a regler le score arrive avant

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
            case 72:
                if(!this.Globalkey.keyboard){
        
                    this.Globalkey.keyboard = true;
                    this.Globalkey.pause = true;
                    this.GetComponent("DisplaySystem").printKeyboardShortcut();
            
                    }else{
            
                    this.Globalkey.keyboard = false;
                    this.Globalkey.pause = false;
                    this.GetComponent("DisplaySystem").printUIHeader(this.player.life,this.score);
            
                }
                    
                break;
            
        }

    }

    OnClick(event){

        switch(event.target.id){

            case "retour":
                 this.GetComponent("DisplaySystem").printPause();
                break;
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
                this.GetComponent("DisplaySystem").printAudioUIMenu();
                break;
            case "video":
                this.GetComponent("DisplaySystem").printVideoUIMenu();
                break;
            case "quit":
                document.location.href = "index.html";
                break;
            default:
                break;

        }

    }

    OnChange(event){

        let sound_sys = this.GetComponent("SoundSystem");
        
        switch(event.target.id){

            case "range_master_volume":  
                sound_sys.masterVolume = event.target.value /100;     
                document.getElementById("sp_master_volume").innerHTML = sound_sys.masterVolume;
                break;
            case "range_sfx_volume":  
                sound_sys.sfxVolume = event.target.value /100;     
                document.getElementById("sp_sfx_volume").innerHTML = sound_sys.sfxVolume;
                break;
            case "range_music_volume":  
                sound_sys.musicVolume = event.target.value /100;     
                document.getElementById("sp_music_volume").innerHTML = sound_sys.musicVolume;
                break;
            default:
                break;

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