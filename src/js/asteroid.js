import Player from "./components/Player/Player.js";
import BasicBullet from "./components/Bullet/BasicBullet.js";
import BasicAsteroid from "./components/Asteroid/BasicAsteroid.js";
import GameManager from "./components/GameSystem/GameManager.js";

import {OBJLoader} from "./Loader/OBJLoader.js"
import {GLTFLoader} from "./Loader/GLTFLoader.js";
import { TextureLoader } from "./three/three.module.js";
import Heart from "./components/Joker/Heart.js";
import Coin from "./components/Joker/Coin.js";

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

        this.loadingManager.onProgress  = function ( ) {

            document.getElementById("end_game").style.display = "none";
        
        };

        this.camera.position.set(0,0.3,0); //0.3 troisieme personne, 2/3 vu en follow, 
        this.camera.lookAt( this.scene.position );

        this.goal = new THREE.Object3D;
        this.follow = new THREE.Object3D;
        this.follow.position.z = - 0.3;
        this.goal.add(this.camera);
        
        window.addEventListener('resize', () => {

            this.OnWindowResize();

          }, false);
        
    }

    LoadModel(){

        this.modelManager = [];

        const loaderObj = new OBJLoader(this.loadingManager);
        const loaderShip = new GLTFLoader(this.loadingManager);

        const textureLoader = new TextureLoader();
        var map = textureLoader.load('../medias/models/textures/asteroid_diffuse.jpg');
        var material = new THREE.MeshPhongMaterial({map:map})

        const geometryAsteroid = new THREE.CylinderBufferGeometry(0.01,0.01,0.1,5,1,false); 
        const materialAsteroid = new THREE.MeshLambertMaterial( );
        
        /*materialAsteroid.color.set(0xff0000)
        materialAsteroid.emissive.set(0xff000d)*/

        const cylinderMesh = new THREE.InstancedMesh( geometryAsteroid, materialAsteroid, 100);
        cylinderMesh.name="Bullet";
        cylinderMesh.rotateX( (Math.PI / 180) *90 );

        this.modelManager.push(cylinderMesh);

        loaderObj.load('../medias/models/low_poly.obj',  ( object ) => {

            object.traverse( function ( child ) {

                if ( child.isMesh ) child.material = material;
            
            } );

            object.name="SpaceRock";
            this.modelManager.push(object);
           
        }); 

        loaderObj.load('../medias/models/explosion.obj',  ( object ) => {

            object.name="SpaceRock";
            this.modelManager.push(object);
           
        }); 

        loaderObj.load("../medias/models/collectable/Love.obj", (object) => {

            object.name="HeartItem";
            this.modelManager.push(object)
        });
        
        loaderObj.load("../medias/models/collectable/coin/Coin.obj", (object) => {

            object.name="CoinItem";
            this.modelManager.push(object)
        });
        

        let me = this;
        loaderShip.load('../medias/models/SpaceShip.gltf',  function(gltf) {

            gltf.scene.name="SpaceShip";
            me.modelManager.push(gltf.scene);

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

        let playerModel; let rockModel; let bulletModel; let heartModel ; let coinModel

        this.modelManager.forEach((e) => {

            if(e.name == "SpaceShip")  playerModel = e;

            if(e.name == "SpaceRock")  rockModel = e;

            if(e.name == "Bullet")  bulletModel = e;

            if(e.name == "HeartItem"){

                e.children[0].name = "Heart"
                heartModel = e

            }  

            if(e.name == "CoinItem")  coinModel = e

        })

        this.basicBullet = new BasicBullet(bulletModel, this.scene);

        this.params = {
            goal: this.goal,
            camera:this.camera,
            follow: this.follow,

            scene: this.scene,
            weapon : this.basicBullet,
            
        }

        const models = {

            player : new Player(this.params, playerModel.children[0]),
            asteroid : new BasicAsteroid(this.scene,rockModel.children[0],-1),
            heart :  new Heart(this.scene, heartModel.children[0]),
            coin : new Coin(this.scene, coinModel.children[0]),

        }

        const utils = {

            renderer : this.renderer,
            scene : this.scene,
            camera : this.camera,

        }

        this.gm = new GameManager(models, utils)
        this.gm.ModelInitialisation(); 

        this.remove = null ;

        this.renderer.render(this.scene, this.camera);

        document.addEventListener('keydown',  this.remove =  this.OnPlayerBegin.bind(this))

    }

    OnPlayerBegin( event ) {

        
        if (event.code == 'Space') {

            document.getElementById("start_game").style.display = "none";
            document.removeEventListener('keydown',  this.remove);
           
            this.gm.GetComponent("LevelSystem").StartLevel();
        }

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


