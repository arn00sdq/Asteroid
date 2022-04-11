import * as THREE from 'three';

import JokerSystem from "./JokerSystem.js";

class LevelSystem{

    constructor(parent){

        this.parent = parent;

        this.currentLevel = "";
        this.edgeLimit = this.parent.limit;

        this.stateScene = {

            startmenu:false,
            stage1:true,
            stage2:false,
            stage3:false,

            stageClear : false,

        }



    }

    InstantiatePlayer(player,position, rotation, scale){
        
        player.scene = this.parent.currentScene;
        player.Instantiate(player,position, rotation, scale);
        player.SetRigidBody(player);
        player.add( new THREE.PositionalAudio(  this.parent.audio.listener ));

    }

    InstantiateEnnemyS(ennemyShip,position, rotation, scale){
        
        ennemyShip.scene = this.parent.currentScene;
        ennemyShip.scale.set(scale,scale,scale)
        ennemyShip.Instantiate(ennemyShip,position, rotation, scale);
        
       // ennemyShip.SetRigidBody(player);
        ennemyShip.add( new THREE.PositionalAudio(  this.parent.audio.listener ));


    }

    InstantiateGameObject(object,position, rotation, scale, velocity, opt,target){

        object.scene = this.parent.currentScene;

        let positionAudio = object.children.find( k=> k.constructor.name == "PositionalAudio")    
        if (positionAudio !== undefined) object.remove(positionAudio)

        
        let object_clone = object.clone();
        this.setCloneValue(object_clone, object);

        if(opt !== undefined ){
            object_clone.userData.type = opt;
        }
        

        object_clone.Instantiate(object_clone,position, rotation, scale,velocity);
        object_clone.SetRigidBody(object_clone);

        if(object_clone.name == "EnnemyBullet") object_clone.lookAt(target)

        this.updateValue(object_clone, object);

        
    }

    InstantiateShader(object,position, rotation, scale, opt){ //instantiateShader

        object.scene = this.parent.currentScene;

        let object_clone = object.clone();
        this.setCloneValue(object_clone, object);
        object_clone.userData.type = opt;

        let mesh = object_clone.children.find(e => e.constructor.name == "Mesh");
        let shaderMat = Object.values(this.parent.shaders).find( val => val.parentName === object.constructor.name);
        mesh.material = shaderMat
        ;
        object_clone.SetRigidBody(object_clone);
        object.Instantiate(object_clone,position, rotation, scale);

        
    }

    InstantiateExplosion(object,position,rotation,scale){

        object.scene = this.parent.currentScene;
        
        let object_clone = object.clone();
        this.setCloneValue(object_clone, object);

        let mesh = object_clone.children.find(e => e.constructor.name == "Mesh")
        mesh.material = this.parent.explosionShader;
        mesh.material.uniforms[ 'opacity' ].value  = 1.0;
        object_clone.Instantiate(object_clone,position, rotation, scale);

    }

    generatingStars(star,min,max){

        const starVertices = []
        for (let i=0; i<5000; i++){
            const x = ( (Math.random()  * max)   * ( Math.round( Math.random() ) ? 1 : -1 ));
            const y = ( ((Math.random()  *  (max - min)) + min)   * ( Math.round( Math.random() ) ? 1 : -1 ));
            const z = ( (Math.random() * max)  * ( Math.round( Math.random() ) ? 1 : -1));
            starVertices.push(x,y,z);
        }
        for (let i=0; i<5000; i++){
            const x = ( ((Math.random()  *  (max - min)) + min)   * ( Math.round( Math.random() ) ? 1 : -1 ));
            const y = ( (Math.random() * max)  * ( Math.round( Math.random() ) ? 1 : -1));
            const z = ( (Math.random() * max)  * ( Math.round( Math.random() ) ? 1 : -1));
            starVertices.push(x,y,z);
        }
       for (let i=0; i<5000; i++){
            const x = ( (Math.random() * max)  * ( Math.round( Math.random() ) ? 1 : -1));
            const y = ( (Math.random() * max)  * ( Math.round( Math.random() ) ? 1 : -1));
            const z = ( ((Math.random()  *  (max - min)) + min)   * ( Math.round( Math.random() ) ? 1 : -1 ));
            starVertices.push(x,y,z);
        }
        
        star.geometry.setAttribute('position', new THREE.Float32BufferAttribute( starVertices,3))

    }

    setCloneValue(destination, source){
       
        for (const property in destination) {
            
            if(destination[property] == null && property !== "model")  destination[property] = source[property]

        }
        
        let mesh = source.children.find(e => e.constructor.name == 'Mesh');
        destination.children.forEach((e) => { 

            if (e.constructor.name == 'Mesh') 
            e.material = mesh.material.clone(); 
            
        });

        destination.add( new THREE.PositionalAudio( this.parent.audio.listener ));

    }

    updateValue(destination, source){

        for (const [key, value] of Object.entries(source)) {

            if(typeof value === 'number')source[key] = destination[key]

        }

    }

    resetLevel() {

        this.parent.state.pause = true;
        this.timeElapsed = 0;
        this.score = 0;

        this.parent.player.ResetPlayer();

        this.removeProps();

    }

    removeProps() {

        let obj;
        for( var i = this.parent.currentScene.children.length - 1; i >= 0; i--) { 
            obj = this.parent.currentScene.children[i];
            this.parent.currentScene.remove(obj); 
        }

    }

    /* ----------- Delimitation ------------ */

    scenePicker(level,init,switchScene){
        
        if(switchScene == undefined) switchScene = false;

        this.removeProps();

        let displaySystem = this.parent.GetComponent("DisplaySystem");
        this.soundSystem  = this.parent.GetComponent("SoundSystem");

        this.currentLevel = level;
        
        switch (level){

            case "StartMenu":
                this.loadScene(level);
                this.loadUI(level,displaySystem);
                this.loadProps(level);
                break;

            case "Stage1":   
                this.loadScene(level);
                this.loadUI(level,displaySystem);
                this.loadProps(level);
                this.loadWave(level)
                this.InstantiatePlayer(this.parent.player, new THREE.Vector3(0,0.0,0), new THREE.Euler(0,0,0),0.0004);
                this.soundSystem.PlayPlayerRespawn();
                //----
                
                break;

            case "Stage2":
                console.log("-- Stage2 --")
                this.loadScene(level);
                this.loadUI(level,displaySystem);
                this.loadProps(level);
                this.loadWave(level)
                this.InstantiatePlayer(this.parent.player, new THREE.Vector3(0,0.0,0), new THREE.Euler(0,0,0),0.0004);
                this.soundSystem.PlayPlayerRespawn();
                break;

            case "Stage3":
                this.loadScene(level);
                this.loadUI(level,displaySystem);
                this.loadProps(level);
                this.loadWave(level)
                this.InstantiatePlayer(this.parent.player, new THREE.Vector3(0,0.0,0), new THREE.Euler(0,0,0),0.0004);
                break;   

        }

        this.loadAudio(level)
        this.parent.PostProcessRender(switchScene); 
        this.gameActive(init);
        

    }

    gameActive(init){

        if(init){

            this.parent.RAF();

        }else{

            this.parent.state.pause = false;

        }

    }

    loadScene(level) {

        switch(level){
            case "StartMenu":          
                let sceneStartMenu = new THREE.Scene();
                this.parent.currentScene = sceneStartMenu;

                this.parent.currentCamera = this.parent.startMenuCamera;
                this.parent.currentCamera.lookAt(new THREE.Vector3(-11,0,0));

                this.parent.RemoveComponent("JokerSystem");
                break;
            case "Stage1":
                this.parent.currentScene = this.parent.stageScene;
                this.parent.currentCamera = this.parent.inGameCamera;

                if (this.parent.components["JokerSystem"] === undefined)
                    this.parent.AddComponent(new JokerSystem(this.parent, this.parent.models));

                break;
            case "Stage2":
                this.parent.currentScene = this.parent.stageScene;
                this.parent.currentCamera = this.parent.inGameCamera;
                             
                if (this.parent.components["JokerSystem"] === undefined) 
                    this.parent.AddComponent(new JokerSystem(this.parent, this.parent.models));

                break;
        }
        
    }

    loadUI(level,displaySystem){

        switch(level){
            case "StartMenu":
                displaySystem.printUIStartMenu();
                break;
            case "Stage1":
                displaySystem.printUIHeader(this.parent.player.life, this.parent.score);
                break;
            case "Stage2":
                displaySystem.printUIHeader(this.parent.player.life, this.parent.score);
                break;
            case "Stage3":
                displaySystem.printUIHeader(this.parent.player.life, this.parent.score);
                break;
            
        }
    }

    loadProps(level){

        switch(level){
            case "StartMenu":
                this.loadPlanetStartMenu({earth : this.parent.earth, stars : this.parent.stars});
                break;
            case "Stage1":
                this.loadAsteroidBackGround(this.parent.asteroid,1);
                this.loadPlanetStageOne({earth : this.parent.earth, sun : this.parent.sun, stars : this.parent.stars});
                break;
            case "Stage2":
                this.loadAsteroidBackGround(this.parent.asteroid,1);
                this.loadPlanetStageOne({earth : this.parent.earth, sun : this.parent.sun, stars : this.parent.stars});
                break;
            case "Stage3":
                break;
        }

    }

    loadWave(level){

        switch(level){
            case "StartMenu":
                break;
            case "Stage1":
                this.asteroidWave(this.parent.asteroid, 5);
                break;
            case "Stage2":
                this.asteroidWave(this.parent.asteroid, 1);
                this.ennemySpaceshipWave(this.parent.ennemy_ss,1)
                break;
            case "Stage3":
                this.asteroidWave(this.parent.asteroid, 1);
                break;
        }

    }

    loadAudio(level){

        let ambientSound = this.parent.ambientSound;
        let soundSystem = this.parent.GetComponent("SoundSystem");

        if(level == "StartMenu"){
           
            const ambientBuffer =  this.parent.audio.audioManager.find(e => e.name == "StartMenuTheme");
			ambientSound.setBuffer(ambientBuffer);
			ambientSound.setVolume(  soundSystem.musicVolume > soundSystem.masterVolume  ? soundSystem.masterVolume : soundSystem.musicVolume );
			ambientSound.play();

        }else{

            if (ambientSound.isPlaying) ambientSound.stop();
            console.log(ambientSound.isPlaying)

        }
    }

    loadPlanetStartMenu(model){

        let atmosphere = this.parent.atmosphere; //manuel
        atmosphere.scale.set(1.1,1.1,1.1);
        atmosphere.position.set(0,0,0);
        this.parent.currentScene.add(atmosphere);

        model.earth.scale.set(1,1,1);
        this.InstantiateShader(model.earth, new THREE.Vector3(0,0,0),  new THREE.Euler(0,0,0), 1, "Planet");

        this.generatingStars(model.stars,200,500);
        this.parent.currentScene.add(model.stars);
        
    } 

    loadPlanetStageOne(model){

        /*earth*/

        model.earth.scale.set(2.6,2.6,2.6)
        let positionEarth = new THREE.Vector3(0,-20,100);
        let rotationEarth  = new THREE.Euler( 0,0,0);
        let scaleEarth  = 1;

        /*sun*/

        model.sun.scale.set(10.6,10.6,10.6)
        let positionSun = new THREE.Vector3(-100,50,-450);
        let rotationSun = new THREE.Euler( 0,0,0);
        let scaleSun = 1;

        /*light*/

        const spotLight = new THREE.SpotLight(0xF7AB29,2,500,(Math.PI/180)*50);
        spotLight.position.set(-100,-5,-150);
        spotLight.target.position.set(0,-20,50);
        this.parent.currentScene.add(spotLight);

        let brightVal = this.parent.GetComponent("MenuSystem").video.brightness;
        const ambientLight = new THREE.AmbientLight(0xFFFFFF,brightVal);
        ambientLight.position.set(0,0,0);
        this.parent.currentScene.add(ambientLight);

        /*atmosphere sun*/

        let sunAtmosphere = this.parent.sunAtmosphere;
        sunAtmosphere.scale.set(12,12,12);
        sunAtmosphere.position.set(-100,50,-450);
        //this.parent.currentScene.add(sunAtmosphere);
        
        //star
        this.generatingStars(model.stars,500,2000);
        this.parent.currentScene.add(model.stars);

        //Instate go
        this.InstantiateShader(model.earth, positionEarth, rotationEarth, scaleEarth, "Planet");
        this.InstantiateShader(model.sun, positionSun, rotationSun, scaleSun, "Planet");

    } 
    

    loadAsteroidBackGround(asteroid,number){

        for (let index = 0; index < number; index++) {

            let position = new THREE.Vector3(  ( Math.random() * 30 )  * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  -5 ,
                                                ( Math.random() * 30 ) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )                       
            let rotation = new THREE.Euler( 0,0,0);
            let scale = (Math.random() * (0.03 -0.015)) + 0.015;
            this.InstantiateGameObject(asteroid, position, rotation, scale,undefined, "BackGround")

        }

    }

    asteroidWave(asteroid, nbAsteroid){

        for (let index = 0; index < nbAsteroid; index++) {

            let position = new THREE.Vector3( ( ( Math.random() * ( this.edgeLimit - (this.edgeLimit / 1.5 ) ) ) + ( this.edgeLimit / 3 )) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() * ( this.edgeLimit - (this.edgeLimit / 2 ) ) ) + ( this.edgeLimit / 3.5 )) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )                       
            let rotation = new THREE.Euler( 0,0,0);
            let scale = (Math.random() * (0.03 -0.015)) + 0.015;
            this.InstantiateGameObject(asteroid, position, rotation, scale,undefined, "Ennemy")

        }

    }

    ennemySpaceshipWave(ennemy_ss, nb_ennemy_ss){

        for (let index = 0; index < nb_ennemy_ss; index++) {

            let position = new THREE.Vector3( ( ( Math.random() * ( this.edgeLimit - (this.edgeLimit / 1.5 ) ) ) + ( this.edgeLimit / 3 )) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() * ( this.edgeLimit - (this.edgeLimit / 2 ) ) ) + ( this.edgeLimit / 3.5 )) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )                       
            let rotation = new THREE.Euler( 0,0,0);
            let scale = 0.2;

            this.InstantiateGameObject(ennemy_ss, position, rotation, scale,undefined, "Ennemy")

        }

    }

    Update(timeElapsed){

       /* if(this.parent.ennemy == 0){

            this.level++;
            this.scenePicker();

        }*/


    }

}

export default LevelSystem