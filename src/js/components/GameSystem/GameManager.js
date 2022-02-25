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


        this.audio = audio

        this.mixer = animation.mixer;
        this.idle = animation.idleAction;

        this.limite = 15;

        this.score = 0;
        this.ennemy = null;

        this.InitComponent(models,audio);

    }

    InitComponent(models,audio){

        
        this.AddComponent(new LevelSystem(this));
        this.AddComponent(new SoundSystem(this,this.audio));
        this.AddComponent(new JokerSystem(this,models));
        this.AddComponent(new DisplaySystem(this));
        this.AddComponent(new HackSystem(this));
        this.AddComponent(new GameObjectManager(this));
        
        this.player.audio_syst = this.GetComponent("SoundSystem");
        
       
    }

    AddComponent(c) {

        this.components[c.constructor.name] = c;   

    }

    GetComponent(n) {

        return this.components[n];

    }

    ModelInitialisation(){


        this.asteroid.InitMesh(new THREE.Vector3(0.0003,0.0003,0.0003));
        this.asteroid.SetRigidBody(this.asteroid);
        this.player.InitMesh(new THREE.Vector3(0.05,0.05,0.05));
        this.heart.InitMesh(new THREE.Vector3(0.002,0.002,0.002));
        this.coin.InitMesh(new THREE.Vector3(0.06,0.06,0.06));
        this.arrow.InitMesh(new THREE.Vector3(0.05,0.05,0.05));
        this.shield.InitMesh(new THREE.Vector3(0.1,0.1,0.1));
        this.basicBullet.InitMesh(new THREE.Vector3(1,1,1));
       // this.basicBullet.SetRigidBody(this.basicBullet.children[0]);

        this.player.GetComponent("PlayerShootProjectiles").weaponParams = this.basicBullet;
        
        
    }

    OnPlayerEnd() {

        document.getElementById("end_game").style.display = "";

    }

    CheckBullet(nbBullet){

        let objectsToRemove = [];
        let bulletToRemove = 2;
        
        if (nbBullet >15){

            this.scene.traverse( function(child ) {
                
                if(child.name == "BasicBullet" && bulletToRemove > 0){
                    
                    objectsToRemove.push(child)
                    bulletToRemove--;

                }

            })

        }

        objectsToRemove.forEach(node => {
			this.scene.remove( node );
		});

    }


    RAF() { // transformer en update ?

        requestAnimationFrame((t) => {

            if (this.previousRAF === null) {

                this.previousRAF = t;
 
            }
            
            this.RAF();
            this.renderer.render(this.scene, this.camera);
            this.Step(t);
            this.previousRAF = t;

         });    

      }
    
    Step(timeElapsed) {  

       // const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);
        /*this.mixer.update(timeElapsed * 0.000001)    */
        for (let k in this.components) {

            this.components[k].Update(timeElapsed * 0.001);

        }

        if (this.player.GetComponent("CharacterControllerInput").keys.screenshot) {
            this.player.GetComponent("CharacterControllerInput").keys.screenshot = false;

            let screenshot = this.renderer.domElement.toDataURL();
            console.log("ScreenShot effectué", screenshot)

          }

    }

}

export default GameManager