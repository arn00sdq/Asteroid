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

    }

    InstantiateGameObject(object,position, rotation, scale, velocity, opt){

        object.scene = this.parent.currentScene;
        let object_clone = object.clone();

        this.SetCloneValue(object_clone, object);

        if(opt !== undefined ){
            object_clone.userData.type = opt;
        }

        object_clone.Instantiate(object_clone,position, rotation, scale,velocity);
        object_clone.SetRigidBody(object_clone);
        this.UpdateValue(object_clone, object);

        
    }

    InstantiatePlanet(object,position, rotation, scale, opt){

        object.scene = this.parent.currentScene;
        object.userData.type = opt;
        object.Instantiate(object,position, rotation, scale);

        
    }

    GeneratingStars(star,min,max){

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

    ResetLevel() {

        this.parent.state.pause = true;
        this.timeElapsed = 0;
        this.score = 0;

        this.parent.player.ResetPlayer();

        this.RemoveProps();

        this.ScenePicker(this.currentLevel,false)

    }

    RemoveProps() {// level_system

        var to_remove = [];

        this.parent.currentScene.traverse(function (child) {
            if ((child.type == "Object3D") && !child.userData.keepMe === true) {
                to_remove.push(child);
            }
        });

        for (var i = 0; i < to_remove.length; i++) {
            this.parent.currentScene.remove(to_remove[i]);
        }

    }

    /* ----------- Delimitation ------------ */

    ScenePicker(level,init){
        
        //this.RemoveProps();
       let displaySystem = this.parent.GetComponent("DisplaySystem");
       this.currentLevel = level;
        
        switch (level){

            case "StartMenu":
                displaySystem.printUIStartMenu();
                this.parent.RemoveComponent("JokerSystem")
                this.LoadStartMenuScene();
                this.loadPlanetBackStartMenu({earth : this.parent.earth, stars : this.parent.stars});
                break;

            case "Stage1":   

                displaySystem.printUIHeader(this.parent.player.life, this.parent.score);
                this.parent.components.JokerSystem == undefined ?
                this.parent.AddComponent(new JokerSystem(this.parent, this.parent.models)) : ``;
                this.LoadGameScene();          
                this.loadAsteroidBackGround(this.parent.asteroid,1);
                this.loadPlanetBackGroundStageOne({earth : this.parent.earth, sun : this.parent.sun, stars : this.parent.stars});
                this.AsteroidWave(this.parent.asteroid, 1);
                this.InstantiatePlayer(this.parent.player, new THREE.Vector3(0,0.0,0), new THREE.Euler(0,0,0),0.0004);
                
                break;

            case "Stage2":
                displaySystem.printUIHeader(this.player.life, this.score);
                this.LoadGameScene();
                this.AsteroidWave(this.parent.asteroid, 1);
                //this.EnnemySpaceshipWave(this.parent.ennemy_ss,1)
                this.InstantiatePlayer(this.parent.player, new THREE.Vector3(0,0.0,0), new THREE.Euler(0,0,0),0.0004);
                break;

            case "Stage3":
                this.LoadGameScene();
                displaySystem.printUIHeader(this.player.life, this.score);
                this.AsteroidWave(this.parent.asteroid, 1);
                this.InstantiatePlayer(this.parent.player, new THREE.Vector3(0,0.0,0), new THREE.Euler(0,0,0),0.0004);
                break;   

        }

        this.parent.PostProcessRender();    

        if(init){

            this.parent.RAF();

        }else{

            this.parent.state.pause = false;

        }

    }

    LoadGameScene() {

        let stageScene = new THREE.Scene();

        this.parent.currentScene = stageScene;
        this.parent.currentCamera = this.parent.inGameCamera;

    }

    LoadStartMenuScene(){

        let sceneStartMenu = new THREE.Scene();
        let startMenuCam = this.parent.startMenuCamera;
        startMenuCam.lookAt(new THREE.Vector3(-11,0,0));

        this.parent.currentScene = sceneStartMenu;
        this.parent.currentCamera = this.parent.startMenuCamera;

    }

    loadPlanetBackStartMenu(model){

        let atmosphere = this.parent.atmosphere;
        atmosphere.scale.set(1.1,1.1,1.1);
        this.parent.currentScene.add(atmosphere);

        let positionEarth = new THREE.Vector3(0,0,0);
        let rotationEarth = new THREE.Euler(0,0,0);
        let scaleEarth = 1;
        this.InstantiatePlanet(model.earth, positionEarth, rotationEarth, scaleEarth, "Planet");

        this.GeneratingStars(model.stars,200,500);
        this.parent.currentScene.add(model.stars);
        
        console.log(this.parent.currentScene)
    } 

    loadPlanetBackGroundStageOne(model){

        /*atmosphere earth*/

        let atmosphere = this.parent.atmosphere;
        atmosphere.scale.set(2.7,2.7,2.7);
        atmosphere.position.set(0,-20,100);
       // this.parent.currentScene.add(atmosphere);

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

        const ambientLight = new THREE.AmbientLight(0xFFFFFF,0.2);
        ambientLight.position.set(0,0,0);
        this.parent.currentScene.add(ambientLight);

        /*atmosphere sun*/

        let sunAtmosphere = this.parent.sunAtmosphere;
        sunAtmosphere.scale.set(12,12,12);
        sunAtmosphere.position.set(-100,50,-450);
        //this.parent.currentScene.add(sunAtmosphere);
        
        //star
        this.GeneratingStars(model.stars,500,2000);
        this.parent.currentScene.add(model.stars);

        //Instate go
        this.InstantiatePlanet(model.earth, positionEarth, rotationEarth, scaleEarth, "Planet");
        this.InstantiatePlanet(model.sun, positionSun, rotationSun, scaleSun, "Planet");

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

    AsteroidWave(asteroid, nbAsteroid){

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

    EnnemySpaceshipWave(ennemy_ss, nb_ennemy_ss){

        for (let index = 0; index < nb_ennemy_ss; index++) {

            let position = new THREE.Vector3( ( ( Math.random() * ( this.edgeLimit - (this.edgeLimit / 2 ) ) ) + ( this.edgeLimit / 2 )) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() * ( this.edgeLimit - (this.edgeLimit / 3 ) ) ) + ( this.edgeLimit / 3 )) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )
            
            let rotation = new THREE.Euler(0,0,0);
            let scale = 0.08;

            this.InstantiateGameObject(ennemy_ss, position, rotation, scale)

        }

    }

    Update(timeElapsed){

       /* if(this.parent.ennemy == 0){

            this.level++;
            this.ScenePicker();

        }*/


    }

}

export default LevelSystem