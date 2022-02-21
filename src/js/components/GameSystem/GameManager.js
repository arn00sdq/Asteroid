import DisplaySystem from "./DisplaySystem.js";
import JokerSystem from "./JokerSystem.js";
import LevelSystem from "./LevelSystem.js";
import GameObjectManager from "./gameObjectManager.js";
import HackSystem from "./HackSystem.js";

class GameManager {

    constructor(models, utils){

        this.components = {}// a voir section print, triche, joker , niveau

        this.renderer = utils.renderer
        this.scene = utils.scene;
        this.camera = utils.camera;

        this.player = models.player;
        this.asteroid = models.asteroid; 
        this.heart = models.heart;
        this.coin = models.coin;

        this.limite = 15;

        this.score = 0;
        this.ennemy = 0;
        this.level = 1;

        this.InitComponent();

    }

    InitComponent(){

        
        this.AddComponent(new LevelSystem(this));
        this.AddComponent(new GameObjectManager(this));
        this.AddComponent(new JokerSystem(this));
        this.AddComponent(new DisplaySystem(this));
        this.AddComponent(new HackSystem(this));
        
       
    }

    AddComponent(c) {

        this.components[c.constructor.name] = c;   

    }

    GetComponent(n) {

        return this.components[n];

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

    PlayerAddLife(number){

        this.player.GetComponent("PlayerHealthSystem").Heal(number);
        this.GetComponent("DisplaySystem").PrintLife(this.player.life);

    }

    PlayerAddCoin(number){

        this.score += number;
        this.GetComponent("DisplaySystem").printScore(this.score);

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

        for (let k in this.components) {

            this.components[k].Update(timeElapsed * 0.001);

        }

    }

}

export default GameManager