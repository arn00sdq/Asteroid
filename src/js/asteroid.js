import Player from "./components/Player/Player.js";
import BasicBullet from "./components/Bullet/BasicBullet.js";
import GameObjectManager from "./gameObjectManager.js";
import BasicAsteroid from "./components/Asteroid/BasicAsteroid.js";
import GameManager from "./GameManager.js";

import {OBJLoader} from "./Loader/OBJLoader.js"
import {GLTFLoader} from "./Loader/GLTFLoader.js";
import { TextureLoader } from "./three/three.module.js";

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

        const loaderAsteroid = new OBJLoader(this.loadingManager);
        const loaderExplosion = new OBJLoader(this.loadingManager);
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

        loaderAsteroid.load('../medias/models/low_poly.obj',  ( object ) => {

            object.traverse( function ( child ) {

                if ( child.isMesh ) child.material = material;
            
            } );

            object.name="SpaceRock";
            this.modelManager.push(object);
           
        }); 

        loaderExplosion.load('../medias/models/explosion.obj',  ( object ) => {

            object.name="SpaceRock";
            this.modelManager.push(object);
           
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

        let playerModel; let rockModel; let bulletModel
        this.modelManager.forEach((e) => {

            if(e.name == "SpaceShip")  playerModel = e;

            if(e.name == "SpaceRock")  rockModel = e;

            if(e.name == "Bullet")  bulletModel = e;

        })

        this.basicBullet = new BasicBullet(bulletModel, this.scene);

        this.gm = new GameManager(this.scene);
        this.GameObjectManager = new GameObjectManager(this.scene,this.modelManager);

        this.params = {
            goal: this.goal,
            camera:this.camera,
            follow: this.follow,

            scene: this.scene,
            weapon : this.basicBullet,
            
        }

        this.gm.player = new Player(this.params, playerModel.children[0]);
        this.gm.asteroid = new BasicAsteroid(this.scene,rockModel.children[0],-1);

        this.gm.InstantiatePlayer();
        this.gm.InstantiateWave();

        this.remove = null ;

        this.renderer.render(this.scene, this.camera);

        document.addEventListener('keydown',  this.remove =  this.OnPlayerBegin.bind(this))

    }

    OnPlayerBegin( event ) {

        
        if (event.code == 'Space') {

            document.getElementById("start_game").style.display = "none";
            document.removeEventListener('keydown',  this.remove);

            this.previousRAF = null;
            this.RAF();
        }

    }

    RAF() {

        requestAnimationFrame((t) => {

            if (this.previousRAF === null) {

                this.previousRAF = t;

            }

            this.RAF();
            this.renderer.render(this.scene, this.camera);
            this.Step(t);
           // console.log(this.scene)
            this.previousRAF = t;

         });    

      }
    
    Step(timeElapsed) {  

        const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);
        this.GameObjectManager.Update(timeElapsed * 0.001);

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


