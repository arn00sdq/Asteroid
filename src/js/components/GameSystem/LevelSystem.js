class LevelSystem{

    constructor(parent){

        this.parent = parent;

    }

    ModelInitialisation(){

        this.parent.asteroid.InitComponent();
        this.parent.asteroid.InitMesh(new THREE.Vector3(0.0003,0.0003,0.0003));

        this.parent.player.InitComponent();
        this.parent.player.InitMesh(new THREE.Vector3(0.05,0.05,0.05));

        this.parent.heart.InitComponent();
        this.parent.heart.InitMesh(new THREE.Vector3(0.05,0.05,0.05));

        this.parent.coin.InitComponent();
        this.parent.coin.InitMesh(new THREE.Vector3(1,1,1));
        
    }

    InstantiatePlayer(player,position, rotation, scene){
        
        player.Instantiate(player,position, rotation, scene);

    }

    InstantiateJoker(joker,position, rotation, scale){

        let jokerClone = joker.clone();

        jokerClone.scene = this.parent.scene;

        jokerClone.Instantiate(jokerClone,position, rotation, scale);

    }

    InstantiateAsteroid(asteroid,position, rotation, scale){

        let asteClone = asteroid.clone();

        asteClone.children[0].material = asteroid.children[0].material.clone();
        asteClone.scene = this.parent.scene;
        asteClone.nbBreak = asteroid.nbBreak + 1;
        asteClone.life = asteClone.life / (asteClone.nbBreak + 1)

        asteClone.Instantiate(asteClone, position, rotation, scale)

    }

    StartLevel(){

        this.ModelInitialisation(); // futur mdel remve scene donc on garde
        
        switch (this.parent.level){

            case 1:
                this.AsteroidWave(this.parent.asteroid, 1);
                break;
            case 2:
                this.BossWave(this.parent.asteroid);
                break;
            case 3:
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

    BossWave(asteroid){

        let scale = 2;
        //this.InstantiateAsteroid(asteroid, position, rotation, scale )

    }

    Update(){}

}

export default LevelSystem