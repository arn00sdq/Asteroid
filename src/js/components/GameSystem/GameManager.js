import DisplaySystem from "./DisplaySystem.js";
import JokerSystem from "./JokerSystem.js";
import LevelSystem from "./LevelSystem.js";
import GameObjectManager from "./gameObjectManager.js";
import HackSystem from "./HackSystem.js";
import SoundSystem from "./SoundSystem.js";


class GameManager {

    constructor(models, utils, animation,audio){

        this.components = {}

        this.renderer = utils.renderer
        this.scene = utils.scene;
        this.camera = utils.camera;

        this.player = models.player;
        this.asteroid = models.asteroid; 
        this.heart = models.heart;
        this.coin = models.coin;
        this.arrow = models.arrow;
        this.shield = models.shield;
        this.basicBullet = models.basicBullet;
        this.ennemyBullet = models.ennemyBullet;
        this.ennemy_ss = models.ennemy_ss;

        this.audio = audio

        this.mixer = animation.mixer;
        this.idle = animation.idleAction;

        this.limite = 15;

        this.score = 0;
        this.ennemy = null;

        this.playerInput = this.player.GetComponent("CharacterControllerInput").keys;

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

        this.ennemy_ss.weaponParams = this.ennemyBullet;
        this.ennemy_ss.asteroid = this.asteroid;
        this.ennemy_ss.target = this.player;

        this.ennemyBullet.name = "EnnemyBullet";


    }

    OnPlayerEnd() {

        document.getElementById("end_game").style.display = "";

    }


    RAF() { // transformer en update ?

            this.id = requestAnimationFrame((t) => {
  

                this.RAF();
                this.renderer.render(this.scene, this.camera);
                this.Step(t);
    
             });  

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