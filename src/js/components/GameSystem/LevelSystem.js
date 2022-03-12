class LevelSystem{

    constructor(parent){

        this.parent = parent;

        this.currentLevel = 1;

    }

    InstantiatePlayer(player,position, rotation, scale){
        
        player.SetRigidBody(player)
        player.Instantiate(player,position, rotation, scale);

    }

    InstantiateGameObject(object,position, rotation, scale, velocity){

        let object_clone = object.clone();

        this.SetCloneValue(object_clone, object);

        object_clone.Instantiate(object_clone,position, rotation, scale,velocity);
        object_clone.SetRigidBody(object_clone);

        this.UpdateValue(object_clone, object);

    }

    InstantiateParticule(particule,position){

        let particule_clone = particule.clone();
        particule_clone.scene = particule.scene;
        console.log(particule_clone)

        //this.SetCloneValue(object_clone, object);

        particule_clone.Instantiate(particule_clone,position, new THREE.Euler(0,0,0),1);

    }

    SetCloneValue(destination, source){

        for (const property in destination) {

            if(destination[property] == null && property !== "model")  destination[property] = source[property]

        }

        let mesh = source.children.find(e => e.constructor.name == 'Mesh');
        destination.children.forEach((e) => { 

            if (e.constructor.name == 'Mesh') 
            e.material = mesh.material.clone(); 
            
        });

    }

    UpdateValue(destination, source){

        for (const [key, value] of Object.entries(source)) {

            if(typeof value === 'number')source[key] = destination[key]

        }

    }

    StartLevel(level,init){
        
        switch (level){

            case 1:
                //this.parent.particuleExplosion.AddParticles();
                this.AsteroidWave(this.parent.asteroid, 10);
                //this.EnnemySpaceshipWave(this.parent.ennemy_ss,1)
                break;
            case 2:
                this.AsteroidWave(this.parent.asteroid, 1);
                break;
            case 3:
                this.AsteroidWave(this.parent.asteroid, 1);
                break;   
        }

        this.InstantiatePlayer(this.parent.player, new THREE.Vector3(0,0.0,0), new THREE.Euler(0,0,0),0.0004)

        if(init){

            this.parent.RAF();

        }else{

            this.parent.Globalkey.pause = false;

        }

    }

    AsteroidWave(asteroid, nbAsteroid){

        for (let index = 0; index < 2; index++) {

            let position = new THREE.Vector3( ( ( Math.random() *  ( 8.5 - 4.5 ) ) + 4.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() *  ( 8.5 - 1 ) ) + 1  ) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )
                                            
            let rotation = new THREE.Euler( 0,0,0);
            let scale = (Math.random() * (0.03 -0.015)) + 0.015;
            this.InstantiateGameObject(asteroid, position, rotation, scale)

        }

    }

    EnnemySpaceshipWave(ennemy_ss, nb_ennemy_ss){

        for (let index = 0; index < nb_ennemy_ss; index++) {

            let position = new THREE.Vector3( ( ( Math.random() *  ( 8.5 - 4.5 ) ) + 4.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() *  ( 8.5 - 1 ) ) + 1  ) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )

            let rotation = new THREE.Euler(0,0,0);
            let scale = 0.08;

            this.InstantiateGameObject(ennemy_ss, position, rotation, scale)

        }

    }

    BossWave(asteroid){

        let position = new THREE.Vector3( ( ( Math.random() *  ( 10.5 - 8.5 ) ) + 8.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() *  ( 10.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )

        let rotation = new THREE.Euler(0,0,0);
        let scale = 10;
        this.InstantiateGameObject(asteroid, position, rotation, scale );
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