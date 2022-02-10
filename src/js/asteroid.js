import Player from "./components/Player.js";
import BasicBullet from "./components/BasicBullet.js";
import GameObjectManager from "./gameObjectManager.js";
import BasicAsteroid from "./components/AsteroidMesh.js";
import GameManager from "./GameManager.js";

import {OBJLoader} from "./Loader/OBJLoader.js"
import {GLTFLoader} from "./Loader/GLTFLoader.js";

class Asteroid {
    constructor() {
        this.Initialize();
        this.LoadModel();
        this.LoadScene();
    }

    Initialize(){

        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.001, 10000 );
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000  );
        this.loadingManager = new THREE.LoadingManager( () => {
            const loadingScreen = document.getElementById( 'loading-screen' );
            loadingScreen.classList.add( 'fade-out' );
            
            loadingScreen.addEventListener( 'transitionend', (e) => {
                this.onTransitionEnd(e)
            }, false );
        });

        this.camera.position.set(0,0.3,0); //0.3 troisieme personne, 2/3 vu en follow, 
        this.camera.lookAt( this.scene.position );

        this.gm= new GameManager(this.scene);
        window.addEventListener('resize', () => {
            this.OnWindowResize();
          }, false);
        
    }

    LoadModel(){
        this.modelManager = [];
        const loaderAsteroid = new OBJLoader(this.loadingManager);
        const loaderShip = new GLTFLoader(this.loadingManager);
        loaderAsteroid.load('../medias/models/rock.obj',  ( object ) => {
            this.modelManager.push(object.children[0]);
           
        }); 
        
        let me = this;
        loaderShip.load('../medias/models/SpaceShip.gltf',  function(gltf) {
            me.modelManager.push(gltf.scene.children[0]);
        }); 
        
    }

    LoadScene(){
        var gridHelper = new THREE.GridHelper( 40, 40 );
        this.scene.add( gridHelper );
        
        this.scene.add( new THREE.AxesHelper() );
        let light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( 50, 50, 50 );
        this.scene.add(light);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.autoClear = false
        document.body.appendChild( this.renderer.domElement );
    }

    LoadProps() {

        this.goal = new THREE.Object3D;
        this.follow = new THREE.Object3D;
        this.follow.position.z = - 0.3;
        this.goal.add(this.camera);
        const basicBullet = new BasicBullet();
        this.GameObjectManager = new GameObjectManager(this.scene, this.modelManager);
        this.params = {
            goal: this.goal,
            camera:this.camera,
            follow: this.follow,
            scene: this.scene,
            gameObj : this.GameObjectManager,
            weapon : basicBullet,
            loader : this.loadingManager,
        }
        
        let player = new Player(this.params);
        player.InitMesh(this.modelManager[1],new THREE.Vector3(0.05,0.05,0.05));
        player.Instantiate(player,new THREE.Vector3(0,0.2,0), new THREE.Euler(0,0,0),this.scene);
        
        for (let index = 0; index < 1; index++) {
            let rVectorPos = new THREE.Vector3(Math.floor(-1), 0 ,Math.floor(Math.random() * 10))
            let rEuleurRot = new THREE.Euler(0,0,0)
            let asteroidProps = new BasicAsteroid(this.scene,0);
            asteroidProps.InitComponent();
            asteroidProps.InitMesh(this.modelManager[0],new THREE.Vector3(0.003,0.003,0.003));
            
            asteroidProps.Instantiate(asteroidProps, rVectorPos, rEuleurRot, this.scene)
        }
        this.previousRAF = null;
        console.log(this.scene)
        this.RAF();
    }

    RAF() {
        requestAnimationFrame((t) => {
            if (this.previousRAF === null) {
                this.previousRAF = t;
            }
            this.RAF();
            this.renderer.render(this.scene, this.camera);
            this.Step(t - this.previousRAF);
            this.previousRAF = t;
         });    
      }
    
    Step(timeElapsed) {  
        const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);

        this.params.gameObj.Update(timeElapsedS);
        this.gm.Update();
    }

    OnWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onTransitionEnd( event ) {
        event.target.remove();
        this.LoadProps();
    }
}

let _App = new Asteroid();

