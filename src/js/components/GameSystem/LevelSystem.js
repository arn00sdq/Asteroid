class LevelSystem{

    constructor(parent){

        this.parent = parent;

        this.level = 1;

    }

    InstantiatePlayer(player,position, rotation, scene){
        
        player.SetRigidBody(player)
        player.Instantiate(player,position, rotation, 0.04);

    }

    InstantiateEnnemySS(ennemy_ss,position, rotation){
        
        let ennemy_ss_clone = ennemy_ss.clone();

        ennemy_ss_clone.children[0].material = ennemy_ss_clone.children[0].material.clone();
        ennemy_ss_clone.scene = ennemy_ss.scene;

        ennemy_ss_clone.SetRigidBody(ennemy_ss_clone)
        ennemy_ss_clone.Instantiate(ennemy_ss_clone,position, rotation, 0.5);

        console.log(this.parent.scene)

    }

    InstantiateJoker(joker,position, rotation, scale){

        joker.nb += 1;
        let jokerClone = joker.clone();

        jokerClone.children[0].material = joker.children[0].material.clone();
        jokerClone.scene = this.parent.scene;
        
        jokerClone.SetRigidBody(jokerClone);
        jokerClone.Instantiate(jokerClone,position, rotation, scale);

    }

    InstantiateAsteroid(asteroid,position, rotation, scale){

        let asteClone = asteroid.clone();

        asteClone.children[0].material = asteroid.children[0].material.clone();
        asteClone.scene = this.parent.scene;
        asteClone.nbBreak = asteroid.nbBreak + 1;
        asteClone.life = asteClone.life / (asteClone.nbBreak + 1)

        asteClone.SetRigidBody(asteClone);
        asteClone.Instantiate(asteClone, position, rotation, scale)

    }

    StartLevel(){
        
        switch (this.level){

            case 1:
                //this.AsteroidWave(this.parent.asteroid, 10);
                this.EnnemySpaceshipWave(this.parent.ennemy_ss,1)
                break;
            case 2:
                this.BossWave(this.parent.asteroid);
                break;
            case 3:
                this.AsteroidWave(this.parent.asteroid, 1);
                break;   
        }

        this.InstantiatePlayer(this.parent.player, new THREE.Vector3(0,0,0), new THREE.Euler(0,0,0),this.parent.scene )

        this.parent.RAF();

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

    EnnemySpaceshipWave(ennemy_ss, nb_ennemy_ss){

        for (let index = 0; index < nb_ennemy_ss; index++) {

            let position = new THREE.Vector3( ( ( Math.random() *  ( 10.5 - 8.5 ) ) + 8.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() *  ( 10.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )

            let rotation = new THREE.Euler(0,0,0);
            let scale = 1;

            this.InstantiateEnnemySS(ennemy_ss, position, rotation, scale)

        }

    }

    BossWave(asteroid){

        let position = new THREE.Vector3( ( ( Math.random() *  ( 10.5 - 8.5 ) ) + 8.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() *  ( 10.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )

        let rotation = new THREE.Euler(0,0,0);
        let scale = 10;
        this.InstantiateAsteroid(asteroid, position, rotation, scale );
        console.log("Vague2")

    }

    Update(timeElapsed){

        if(this.parent.ennemy == 0){

            this.level++;
            this.StartLevel();

        }


    }

}

export default LevelSystem