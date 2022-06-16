import * as THREE from 'three';

import JokerSystem from "./JokerSystem.js";
import {cameraStartLevel} from "../Animation/cameraStartLevel.js"
import Timer from '../Timer/timer.js';
import SunShrinking from '../GameObject/Planet/SunShrinking.js';


class LevelSystem{

    constructor(parent){

        this.parent = parent;

        this.currentLevel = "";
        this.edgeLimit = this.parent.limit;

        this.stateScene = {

            StartMenu:false,
            Stage1:true,
            Stage2:false,
            Stage3:false,

            stageClear : false,

        }

        this.player = this.parent.gameModels.player;

        this.playerHealth = this.parent.gameModels.player.GetComponent("PlayerHealthSystem");
        this.playerMouvement = this.parent.gameModels.player.GetComponent("CharacterMouvement");
        this.playerShoot = this.parent.gameModels.player.GetComponent("PlayerShootProjectiles");

        this.soundSystem = this.parent.GetComponent("SoundSystem");

        this.timer = new Timer();

    }

    InstantiatePlayer(player,position, rotation, scale){
        
        player.scene = this.parent.currentScene;
        player.Instantiate(player,position, rotation, 0.03);
        player.SetRigidBody(player);

    }

    InstantiateGameObject(object,position, rotation, scale, opt){

        object.scene = this.parent.currentScene;
      
        let object_clone = object.clone();
        this.setCloneValue(object_clone, object);

        if(opt !== undefined ){
            object_clone.userData.type = opt;
        }      
        
        object_clone.Instantiate(object_clone,position, rotation, scale);
        object_clone.SetRigidBody(object_clone);
        
        if(object_clone.name == "EnnemyBullet") object_clone.lookAt(object_clone.userData.player.x,object_clone.userData.player.y,object_clone.userData.player.z)

        this.updateValue(object_clone, object);

        if (object.constructor.name == "Explosion") console.log( object.children[0].material.uniforms[ 'opacity' ].value)

        
    }

    setCloneValue(destination, source){

        for (const property in source) {
            
            if(destination[property] == null && property !== "model"){
             
                destination[property] = source[property];      

            }  

        }

        destination.children.forEach((e) => { 

            if (!e.isMesh) return;

            if(Object.values(this.parent.shaders).find( val => val.parentName === destination.constructor.name)){

                 e.material = Object.values(this.parent.shaders).find( val => val.parentName === destination.constructor.name);

            }else{
                
                let mesh = source.children.find(e => e.constructor.name == 'Mesh');
                e.material = mesh.material.clone();
                                       
            }   
            
        });

        if (source.constructor.name == "Explosion") destination.children[0].material.uniforms[ 'opacity' ].value  = 1.0; 
        console.log()
        
    }

    updateValue(destination, source){

        for (const [key, value] of Object.entries(source)) {

            if(typeof value === 'number')source[key] = destination[key]

        }

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

    resetLevel(level) {

        this.timeElapsed = 0;
        this.parent.score = 0;

        this.player.ResetPlayer();

        this.checkSceneState(level);
        this.removeProps();
        this.resetJoker();

        this.parent.gameAudio.sound.ambientSound.play();// si on doit restart la musique on doit play pour que le stop puisse se faire
        this.parent.gameAudio.sound.ambientSound.stop();


        if(level == "Stage3") this.resetTimer();     

    }

    removeProps() {

        let obj;
        let children = this.parent.currentScene.children;
        for( var i = children.length - 1; i >= 0; i--) { 
            obj = children[i];

            if ( children[i].constructor.name == "Sun" && children[i].GetComponent("SunShrinking") !== undefined ){
                children[i].GetComponent("SunShrinking").timer.onTimesUp();               
            }
            this.parent.currentScene.remove(obj); 

        }

        let shieldToRemove = this.parent.gameModels.player.children.find(e => e.constructor.name == "Shield")
        if( shieldToRemove!== undefined) this.parent.scene.remove(this.parent.gameModels.player.children["Shield"])

    }

    resetTimer(){



        this.timer.timeLeft = 86;
        this.timer.timePassed = 0;
        this.timer.paused = false;



    }

    resetJoker(){
        
        for (const value in this.parent.gameModels)
            if (this.parent.gameModels[value].userData.type == "joker")
                this.parent.gameModels[value].nb = 0;
    }

    /* ----------- Delimitation ------------ */

    scenePicker(level,init,switchScene){
        
        if(switchScene == undefined) switchScene = false;
        

        this.currentLevel = level;

        let displaySystem = this.parent.GetComponent("DisplaySystem");
        
        this.resetLevel(level);
          
        switch (level){

            case "StartMenu":
                this.loadScene(level);
                this.loadUI(level,displaySystem);
                this.loadProps(level);
                break;

            default :   
                this.loadScene(level);
                this.loadLight(level);
                this.loadUI(level,displaySystem);
                this.loadTimer(level, displaySystem);
                this.loadProps(level);
                this.loadWave(level);
                this.InstantiatePlayer(this.player, new THREE.Vector3(0,0.0,0), new THREE.Euler(0,0,0),0.0004);
                this.loadAnimation()
                this.soundSystem.playSfxInstantPlayer(this.soundSystem.audioManager.find(e => e.name == "ShipRespawn"))
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

    checkSceneState(level){

        for (const [key, value] of Object.entries(this.stateScene)) {

            key == level ? this.stateScene[key] = true : this.stateScene[key] = false;     

        }

        if(this.parent.gameModels.sun["SunShrinking"] !== undefined) this.parent.gameModels.sun.RemoveComponent("SunShrinking");
        
        if (level == "StartMenu") {
            this.parent.RemoveComponent("JokerSystem");

        }else if(this.parent.components["JokerSystem"] === undefined){
            this.parent.AddComponent(new JokerSystem(this.parent, this.parent.gameModels));

        }

    }

    loadScene(level) {

        this.parent.currentScene = level == "StartMenu" ?  new THREE.Scene() : this.parent.utils.stageScene;
        this.parent.currentCamera = level == "StartMenu" ? this.parent.utils.startMenuCamera : this.parent.utils.inGameCamera;
        
    }

    loadLight(){
        
        const spotLight = new THREE.SpotLight(0xF7AB29,3,500,(Math.PI/180)*50);
        spotLight.position.set(-100,-5,-150);
        spotLight.target.position.set(0,-20,50);
        this.parent.currentScene.add(spotLight);

        let brightVal = this.parent.GetComponent("MenuSystem").video.brightness;
        const ambientLight = new THREE.AmbientLight(0xFFFFFF,brightVal);
        ambientLight.position.set(0,0,0);
        this.parent.currentScene.add(ambientLight);

    }

    loadUI(level,displaySystem){
        level == "StartMenu" ?  displaySystem.printUIStartMenu() 
                              : displaySystem.printUIHeader(this.playerHealth.life,this.playerMouvement.stamina, this.playerShoot.ultimate, this.parent.score); // liste en parametre
        
    }

    loadTimer(level, displaySystem){
        if(level == "Stage3"){

            displaySystem.printTimer(); 
            console.log("je demarre")
            this.timer.startTimer()
            this.timer.restart = true;


        }
        

    }

    loadProps(level){
        switch(level){
            case "StartMenu":
                this.loadPlanetStartMenu({earth : this.parent.gameModels.earth, stars : this.parent.shaders.stars});
                break;
            case "Stage1":
                this.loadAsteroidBackGround(this.parent.gameModels.basicAsteroid,50);
                this.loadPlanetStageOne({earth : this.parent.gameModels.earth, sun : this.parent.gameModels.sun, stars : this.parent.shaders.stars});
                break;
            case "Stage2":
                this.loadAsteroidBackGround(this.parent.gameModels.basicAsteroid,50);
                this.loadPlanetStageOne({earth : this.parent.gameModels.earth, sun : this.parent.gameModels.sun, stars : this.parent.shaders.stars});
                break;
            case "Stage3":
                this.loadAsteroidBackGround(this.parent.gameModels.basicAsteroid,50);
                this.loadPlanetStageOne({earth : this.parent.gameModels.earth, sun : this.parent.gameModels.sun, stars : this.parent.shaders.stars});
                //ajout compo soleil
                break;
        }

    }

    loadWave(level){

        switch(level){
            case "StartMenu":
                break;
            case "Stage1":
                this.asteroidWave(this.parent.gameModels.basicAsteroid, 8);
                break;
            case "Stage2":
                this.asteroidWave(this.parent.gameModels.basicAsteroid, 5);
                this.ennemySpaceshipWave(this.parent.gameModels.ennemyShip,1)
                break;
            case "Stage3":
                this.asteroidWave(this.parent.gameModels.basicAsteroid, 8);
                this.ennemySpaceshipWave(this.parent.gameModels.ennemyShip,2)
                break;
        }

    }

    loadAudio(level){

        let ambientBuffer = this.parent.gameAudio.audioManager;
        let ambientSound = this.parent.gameAudio.sound.ambientSound;

        if(ambientSound.isPlaying) ambientSound.stop();

        switch(level){
            case "StartMenu":
                this.soundSystem.playAmbientMusic(ambientBuffer.find(e => e.name == "StartMenuTheme"));
                break;
            case "Stage1":
                this.soundSystem.playAmbientMusic(ambientBuffer.find(e => e.name == "stage1-ambient"));
                break;
            case "Stage2":
                this.soundSystem.playAmbientMusic(ambientBuffer.find(e => e.name == "stage2-ambient"));
                break;
            case "Stage3":
                this.soundSystem.playAmbientMusic(ambientBuffer.find(e => e.name == "stage3-ambient"));
                break;
        }
    }

    loadAnimation(){// parametre si + de 1

        this.parent.mixer = new THREE.AnimationMixer( this.parent.currentCamera );
	    this.clipAction = this.parent.mixer.clipAction( cameraStartLevel() );
        this.clipAction.loop= THREE.LoopOnce;
        this.clipAction.play();

    }

    loadPlanetStartMenu(model){

        let atmosphere = this.parent.shaders.atmosphere; //manuel
        atmosphere.scale.set(1.1,1.1,1.1);
        atmosphere.position.set(0,0,0);
        this.parent.currentScene.add(atmosphere);

        model.earth.scale.set(1,1,1);
        this.InstantiateGameObject(model.earth, new THREE.Vector3(0,0,0),  new THREE.Euler(0,0,0), 1, "Planet");

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

        model.sun.scale.set(10,10,10)
        let positionSun = new THREE.Vector3(-100,50,-450);
        let rotationSun = new THREE.Euler( 0,0,0);
        let scaleSun = 1;

        /*atmosphere sun*/

      /*  let sunAtmosphere = this.parent.sunAtmosphere;
        sunAtmosphere.scale.set(12,12,12);
        sunAtmosphere.position.set(-100,50,-450);*/
        //this.parent.currentScene.add(sunAtmosphere);
        
        //star
        this.generatingStars(model.stars,500,2000);
        this.parent.currentScene.add(model.stars);

        //Instate go
        this.InstantiateGameObject(model.earth, positionEarth, rotationEarth, scaleEarth, "Planet");
        this.InstantiateGameObject(model.sun, positionSun, rotationSun, scaleSun, "Planet");

    } 
    

    loadAsteroidBackGround(asteroid,number){

        for (let index = 0; index < number; index++) {

            let position = new THREE.Vector3(  ( Math.random() * 30 )  * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  -5 ,
                                                ( Math.random() * 30 ) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )                       
            let rotation = new THREE.Euler( 0,0,0);
            let scale = (Math.random() * (0.03 -0.015)) + 0.015;
            this.InstantiateGameObject(asteroid, position, rotation, scale, "BackGround")

        }

    }

    asteroidWave(asteroid, nbAsteroid){

        for (let index = 0; index < nbAsteroid; index++) {

            let position = new THREE.Vector3( ( ( Math.random() * ( this.edgeLimit - (this.edgeLimit / 1 ) ) ) + ( this.edgeLimit / 2 )) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() * ( this.edgeLimit - (this.edgeLimit / 1.5 ) ) ) + ( this.edgeLimit / 2.5 )) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )                       
            let rotation = new THREE.Euler( 0,0,0);
            let scale = (Math.random() * (0.03 -0.015)) + 0.015;
            this.InstantiateGameObject(asteroid, position, rotation,scale, "Ennemy")

        }

    }

    ennemySpaceshipWave(ennemy_ss, nb_ennemy_ss){

        for (let index = 0; index < nb_ennemy_ss; index++) {

            let position = new THREE.Vector3( ( ( Math.random() * ( this.edgeLimit - (this.edgeLimit / 1 ) ) ) + ( this.edgeLimit / 2 )) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() * ( this.edgeLimit - (this.edgeLimit / 1.5 ) ) ) + ( this.edgeLimit / 2.5 )) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )                       
            let rotation = new THREE.Euler( 0,0,0);
            let scale = 0.2;

            this.InstantiateGameObject(ennemy_ss, position, rotation, scale, "Ennemy")

        }

    }

    endStage3(){

        this.parent.currentScene.traverse( function(child ) {

            if(child.constructor.name !== "Sun")  return;
            
            child.AddComponent(new SunShrinking(child));
            
        })

        let ambientBuffer = this.parent.audio.audioManager;
        this.soundSystem.playAmbientMusic(ambientBuffer.find(e => e.name == "stage3-supernova"))
        document.getElementById("timer").innerHTML = "";
        this.stateScene.Stage3 = false;

    }

    Update(timeElapsed){

        if(this.timer.timeLeft == 0 && this.stateScene.Stage3){
            this.endStage3();
          //  this.timeElapsed.onTimesUp();

        } 

    }

}

export default LevelSystem