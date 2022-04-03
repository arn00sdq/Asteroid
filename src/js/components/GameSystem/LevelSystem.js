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

    InstantiateParticule(particule,position){

        let particule_clone = particule.clone();
        particule_clone.scene = particule.scene;

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
                this.loadPlanetBackStartMenu(this.parent.earth);
                break;

            case "Stage1":   

            
                displaySystem.printUIHeader(this.parent.player.life, this.parent.score);
                this.parent.components.JokerSystem == undefined ?
                this.parent.AddComponent(new JokerSystem(this.parent, this.parent.models)) : ``;

                this.LoadGameScene();          
                this.loadAsteroidBackGround(this.parent.asteroid,50);
                this.loadPlanetBackGroundStageOne(this.parent.earth);
                this.AsteroidWave(this.parent.asteroid, 10);
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

        if(init){
            console.log("ca commence")
            this.parent.RAF();

        }else{

            this.parent.state.pause = false;

        }

    }

    LoadGameScene() {

        let stageScene = new THREE.Scene();

        let gridHelper = new THREE.GridHelper(40, 40);
        const light = new THREE.AmbientLight(0xffffff, 1);
        light.position.set(0, 10, 0);   

        stageScene.add(gridHelper);
        stageScene.add(new THREE.AxesHelper());  
        stageScene.add(light);

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

    loadPlanetBackStartMenu(earth){

        let atmosphere = this.parent.atmosphere;
        
        atmosphere.scale.set(1.1,1.1,1.1);
        this.parent.currentScene.add(atmosphere);

        let position = new THREE.Vector3(0,0,0);
        let rotation = new THREE.Euler(0,0,0);
        let scale = 1;
        this.InstantiateGameObject(earth, position, rotation, scale,undefined, "Planet");
        

    } 

    loadPlanetBackGroundStageOne(earth){

        let atmosphere = this.parent.atmosphere;
        
        atmosphere.scale.set(1.1,1.1,1.1);
        atmosphere.position.set(0,-20,60)
        this.parent.currentScene.add(atmosphere);

        let position = new THREE.Vector3(0,-20,60);
        let rotation = new THREE.Euler( 0,0,0);
        let scale = 1;
        this.InstantiateGameObject(earth, position, rotation, scale,undefined, "Planet");

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

        for (let index = 0; index < 5; index++) {

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

    BossWave(asteroid){

        let position = new THREE.Vector3( ( ( Math.random() *  ( 10.5 - 8.5 ) ) + 8.5 ) * ( Math.round( Math.random() ) ? 1 : -1 ) , 
                                                  0 ,
                                              ( ( Math.random() *  ( 10.5 - 2 ) ) + 2  ) * ( Math.round( Math.random() ) ? 1 : -1 )
                                            )

        let rotation = new THREE.Euler(0,0,0);
        let scale = 10;
        this.InstantiateGameObject(asteroid, position, rotation, scale );

    }

    Update(timeElapsed){

       /* if(this.parent.ennemy == 0){

            this.level++;
            this.ScenePicker();

        }*/


    }

}

export default LevelSystem