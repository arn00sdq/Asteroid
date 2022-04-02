class LevelSystem{

    constructor(parent){

        this.parent = parent;

        this.currentLevel = 1;
        this.edgeLimit = this.parent.limit;

        this.StateScene = {

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

    ResetLevel() {// levelSystem

        this.parent.state.pause = true;
        this.timeElapsed = 0;
        this.score = 0;

        this.parent.player.ResetPlayer();

        this.RemoveProps();

        this.parent.GetComponent("DisplaySystem").printUIHeader(1, 0);

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
        
        this.RemoveProps();
        let displaySystem = this.parent.GetComponent("DisplaySystem");
        
        switch (level){

            case "StartMenu":
                displaySystem.printUIStartMenu();
                this.LoadStartMenuScene();
                this.loadPlanetBackStartMenu(this.parent.earth);
                break;

            case "Stage1":   
                displaySystem.printUIHeader(this.player.life, this.score);
                this.LoadGameScene();          
                this.loadAsteroidBackGround(this.parent.asteroid,50);
                this.loadPlanetBackGroundStageOne(this.parent.earth);
                this.AsteroidWave(this.parent.asteroid, 10);
                this.InstantiatePlayer(this.parent.player, new THREE.Vector3(0,0.0,0), new THREE.Euler(0,0,0),0.0004);
                //this.EnnemySpaceshipWave(this.parent.ennemy_ss,1)
                break;

            case "Stage1":
                displaySystem.printUIHeader(this.player.life, this.score);
                this.LoadGameScene();
                this.AsteroidWave(this.parent.asteroid, 1);
                break;

            case "Stage2":
                this.LoadGameScene();
                displaySystem.printUIHeader(this.player.life, this.score);
                this.AsteroidWave(this.parent.asteroid, 1);
                break;   

        }

        if(init){
            this.parent.RAF();

        }else{

            this.parent.state.pause = false;

        }

    }

    LoadGameScene() {

        let gridHelper = new THREE.GridHelper(40, 40);
        const light = new THREE.AmbientLight(0xffffff, 1);
        light.position.set(0, 10, 0);

        let stageScene = new THREE.Scene();

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

        const _VS = `
        varying vec3 vertexNormal;
        void main() {
            
            vertexNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        }`
        ;

        const _FS = `
        varying vec3 vertexNormal;
        
        void main() {
            
            float intensity = pow(0.5 - dot( vertexNormal, vec3(0,0,1.0)),2.0);
            gl_FragColor = vec4(0.3,0.6,1.0,1.0) * intensity;

        }`;
        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(5, 50, 50),
            new THREE.ShaderMaterial({
                vertexShader: _VS,
                fragmentShader: _FS,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
    
            })

        ) 
        
        atmosphere.scale.set(1.1,1.1,1.1);
        this.parent.currentScene.add(atmosphere);

    }

    loadPlanetBackStartMenu(earth){

        let position = new THREE.Vector3(0,0,0);
        let rotation = new THREE.Euler(0,0,0);
        let scale = 1;
        this.InstantiateGameObject(earth, position, rotation, scale,undefined, "Planet")

    } 

    loadPlanetBackGroundStageOne(earth){

        let position = new THREE.Vector3(0,-20,60);
        let rotation = new THREE.Euler( 0,0,0);
        let scale = 1;
        this.InstantiateGameObject(earth, position, rotation, scale,undefined, "Planet")

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
            this.InstantiateGameObject(asteroid, position, rotation, scale)

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