import GameObjectManager from "./gameObjectManager.js";

class GameManager {

    constructor(models, utils){

        this.components = {}

        this.renderer = utils.renderer
        this.scene = utils.scene;
        this.camera = utils.camera;

        this.player = models.player;
        this.asteroid = models.asteroid; 

        this.heart = models.heart;
        this.coin = models.coin;

        this.limite = 15;
        
        this.nextSecond = null;

        this.score = 0;
        this.ennemy = 0;
        this.level = 1;

        this.InitComponent();

    }

    // Composants gameManager a voir a la fin print ect 

    AddComponent(c) {

        this.components[c.constructor.name] = c;   

    }

    InitComponent(){

        this.AddComponent(new GameObjectManager(this));
       
    }

    OnPlayerEnd() {

        document.getElementById("end_game").style.display = "";

    }

    
    ModelInitialisation(){

        this.asteroid.InitComponent();
        this.asteroid.InitMesh(new THREE.Vector3(0.0003,0.0003,0.0003));

        this.player.InitComponent();
        this.player.InitMesh(new THREE.Vector3(0.05,0.05,0.05));

        this.heart.InitComponent();
        this.heart.InitMesh(new THREE.Vector3(0.05,0.05,0.05));

        this.coin.InitComponent();
        this.coin.InitMesh(new THREE.Vector3(1,1,1));
        
    }

    StartLevel(){

        this.ModelInitialisation(); // futur mdel remve scene donc on garde
        
        switch (this.level){

            case 1:
                this.AsteroidWave(this.asteroid, 1);
                break;
            case 2:
                this.BossWave(this.asteroid);
                break;
            case 3:
                break;
        }

        this.InstantiatePlayer(this.player, new THREE.Vector3(0,0,0), new THREE.Euler(0,0,0),this.scene )

        this.RAF();

    }

    AsteroidWave(asteroid, nbAsteroid){

        for (let index = 0; index < nbAsteroid; index++) {

            let position = new THREE.Vector3( ( ( Math.random() *  ( 10.5 - 8.5 ) ) + 8.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() *  ( 10.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )

            let rotation = new THREE.Euler(0,0,0);
            let scale = 1;

            this.InstantiateAsteroid(asteroid, position, rotation, scale)

        }

    }

    BossWave(asteroid){

        let scale = 2;
        //this.InstantiateAsteroid(asteroid, position, rotation, scale )

    }


    InstantiatePlayer(player,position, rotation, scene){
        
        player.Instantiate(player,position, rotation, scene);

    }

    InstantiateJoker(joker,position, rotation, scale){

        let jokerClone = joker.clone();

        jokerClone.scene = this.scene;

        jokerClone.Instantiate(jokerClone,position, rotation, scale);

    }

    InstantiateAsteroid(asteroid,position, rotation, scale){

        let asteClone = asteroid.clone();

        asteClone.children[0].material = asteroid.children[0].material.clone();
        asteClone.scene = this.scene;
        asteClone.nbBreak = asteroid.nbBreak + 1;
        asteClone.life = asteClone.life / (asteClone.nbBreak + 1)

        asteClone.Instantiate(asteClone, position, rotation, scale)

    }

    printScore(){
        
        document.getElementById("score").appendChild = this.score;

    }

    PrintLife(life) {

        if(life !== undefined) document.getElementById("life").innerHTML = life;

    }

    CountEnnemy(nbEnnemyFrame){

        this.ennemy = nbEnnemyFrame;

        document.getElementById("remaining_asteroid").innerHTML = this.ennemy;

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

    JokerSystem(timeElapsed){

        if(this.nextSecond !== Math.round(timeElapsed)){

            // futur random
            this.nextSecond =  Math.round(timeElapsed);

            if(this.nextSecond % 3 == 0){

                let position = new THREE.Vector3( ( ( Math.random() *  ( 9.5 - 1.5 ) ) + 1.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                0 ,
                                                    ( ( Math.random() *  ( 9.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 )
                                                )

                let rotation = new THREE.Euler(0,0,0);
                

                let randomJoker = Math.round(( Math.random() *  ( 1 - 0) ) + 0)
                let scale;

                switch (randomJoker) {

                    case 0 :
                        scale = 0.03;
                        this.InstantiateJoker(this.heart,position,rotation,scale);
                        break

                    case 1 :
                        scale = 0.1;
                        this.InstantiateJoker(this.coin,position,rotation,scale);
                        break

                }
         
            } 
          
          }
    
          if(this.nextSecond < Math.round(timeElapsed))  this.nextSecond = null 

    }

    RAF() {

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

        const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);

        for (let k in this.components) {

            this.components[k].Update(timeElapsed * 0.001);

        }

    }

}

export default GameManager