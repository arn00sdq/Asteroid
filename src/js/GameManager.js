class GameManager {

    constructor(scene, player, asteroid, joker){

        this.player = player;
        this.asteroid = asteroid; 
        this.joker = joker;

        this.limite = 15;

        this.scene = scene;
        this.score = 0;
        this.ennemy = 0;
        this.level = 1;

    }

    OnPlayerEnd() {

        document.getElementById("end_game").style.display = "";

    }

    InstantiatePlayer(){
        
        this.player.InitMesh(new THREE.Vector3(0.05,0.05,0.05));
        this.player.Instantiate(this.player,new THREE.Vector3(0,0,0), new THREE.Euler(0,0,0),this.scene);

    }

    InstantiateJoker(){

        console.log(this.joker)
        this.joker.InitMesh(0,new THREE.Vector3(0.03,0.03,0.03));
        this.joker.Instantiate(this.joker,new THREE.Vector3(0,0,0), new THREE.Euler(0,0,0));

    }

    InstantiateWave(){

        this.asteroid.InitComponent();
        this.asteroid.InitMesh(new THREE.Vector3(0.0003,0.0003,0.0003));
        
        switch (this.level){

            case 1:
                this.AsteroidWave(this.asteroid, 2);
                break;
            case 2:
                this.BossWave(this.asteroid);
                break;
            case 3:
                break;
        }

    }

    AsteroidWave(asteroid, nbAsteroid){

        for (let index = 0; index < nbAsteroid; index++) {

            let position = new THREE.Vector3( ( ( Math.random() *  ( 10.5 - 8.5 ) ) + 8.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() *  ( 10.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )

            let rotation = new THREE.Euler(0,0,0);
            let scale = 1;

            this.SpawnAsteroid(asteroid, position, rotation, scale)

        }

    }

    BossWave(asteroid){

        let scale = 2;
        //this.SpawnAsteroid(asteroid, position, rotation, scale )

    }

    SpawnAsteroid(asteroid,position, rotation, scale){

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

}

export default GameManager