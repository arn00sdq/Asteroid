import Player from "./components/Player/Player.js";
import BasicBullet from "./components/Bullet/BasicBullet.js";
import BasicAsteroid from "./components/Asteroid/BasicAsteroid.js";
import GameManager from "./components/GameSystem/GameManager.js";

import {OBJLoader} from "./Loader/OBJLoader.js"
import {GLTFLoader} from "./Loader/GLTFLoader.js";
import { TextureLoader } from "./three/three.module.js";
import Heart from "./components/Joker/Heart.js";
import Coin from "./components/Joker/Coin.js";
import Arrow from "./components/Joker/Arrow.js";
import Shield from "./components/Joker/Shield.js";
import EnnemySpaceship from "./components/EnnemySpaceship/EnnemySpaceship.js";

class Asteroid {
    constructor() {

        this.Initialize();
        this.LoadModel();
        this.LoadAudio();
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

        this.listener = new THREE.AudioListener();
        this.camera.add( this.listener );

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
        this.animationsManager = [];
        this.idleAction = null;

        const loaderObj = new OBJLoader(this.loadingManager);
        const loaderShip = new GLTFLoader(this.loadingManager);
        
        /* 
        * texture
        */

        const textureLoader = new TextureLoader();
        var map = textureLoader.load('../medias/models/textures/asteroid_diffuse.jpg');
        var material = new THREE.MeshPhongMaterial({map:map})

        var mapCoin = textureLoader.load('../medias/models/collectable/coin/textures/Coin_Gold_albedo.png');
        var materialCoin = new THREE.MeshPhongMaterial({map:mapCoin});

        var mapShield = textureLoader.load('../medias/models/collectable/shield/texture_shield.png');
        var materialShield = new THREE.MeshPhongMaterial({map:mapShield});

        var mapEnnemySS = textureLoader.load('../medias/models/Ennemy/textures/E-45 _col.jpg');
        var materialEnnemySS = new THREE.MeshPhongMaterial({map:mapEnnemySS});

        const geometryAsteroid = new THREE.CylinderBufferGeometry(0.01,0.01,0.1,5,1,false); 
        const materialAsteroid = new THREE.MeshLambertMaterial( );
        
        materialAsteroid.color.set(0xff0000)
        materialAsteroid.emissive.set(0xff000d)


        const cylinderMesh = new THREE.Mesh( geometryAsteroid, materialAsteroid);
        cylinderMesh.name="Bullet";
        cylinderMesh.rotateX( (Math.PI / 180) *90 );

        /* 
        * ModelManager
        */
        this.modelManager.push(cylinderMesh);

        loaderObj.load('../medias/models/low_poly.obj',  ( object ) => {

            object.traverse( function ( child ) {

                if ( child.isMesh ) child.material = material;
            
            } );

            object.name="SpaceRock";
            this.modelManager.push(object);
           
        }); 

        loaderObj.load('../medias/models/Ennemy/ennemy_ss.obj',  ( object ) => {

            object.traverse( function ( child ) {

                if ( child.isMesh ) child.material = materialEnnemySS;
            
            } );

            object.name="EnnemySpaceship";
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

        loaderObj.load("../medias/models/collectable/shield/shield.obj", (object) => {

            object.traverse( function ( child ) {

                if ( child.isMesh ) child.material = materialShield;

            });
            
            object.children[0].rotateX( (Math.PI / 180) *90 );
            object.name="ShieldItem";
            this.modelManager.push(object)

        });
        
        loaderObj.load("../medias/models/collectable/coin/Coin.obj", (object) => {

            object.traverse( function ( child ) {

                if ( child.isMesh ) child.material = materialCoin;
            
            });

            object.name="CoinItem";
            this.modelManager.push(object)

        });

        loaderObj.load("../medias/models/collectable/addBeam/arrow.obj", (object) => {

            object.name="ArrowItem";
            this.modelManager.push(object)
            
        });
        

        let me = this;
        
        loaderShip.load('../medias/models/SpaceShip.gltf',  function(gltf) {
            me.animationsManager.push(new THREE.AnimationMixer( gltf.scene ));
            me.idleAction = me.animationsManager[0].clipAction( gltf.animations[0] )
            gltf.scene.name="SpaceShip";
            me.modelManager.push(gltf.scene);
            me.idleAction.play()

        }); 
        
    }

    LoadAudio(){

        this.audioManager = [];

        this.sound = new THREE.Audio( this.listener );

        const audioLoader = new THREE.AudioLoader();
        let me = this;
        audioLoader.load( '../medias/sounds/coin/coin.mp3', function( buffer ) {
            buffer.name = "Coin";
            me.audioManager.push(buffer);
        });

        audioLoader.load( '../medias/sounds/heart/heart.mp3', function( buffer ) {
            buffer.name = "Heart";
            me.audioManager.push(buffer);
        });

        audioLoader.load( '../medias/sounds/bullet/bullet.mp3', function( buffer ) {
            buffer.name = "Bullet";
            me.audioManager.push(buffer);
        });

        audioLoader.load( '../medias/sounds/hit/hit.mp3', function( buffer ) {
            buffer.name = "BulletHit";
            me.audioManager.push(buffer);
        });

        audioLoader.load( '../medias/sounds/ship/ship.mp3', function( buffer ) {
            buffer.name = "ShipDamageTaken";
            me.audioManager.push(buffer);
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

        let playerModel; let rockModel; let bulletModel; let heartModel ; let coinModel;
        let arrowModel; let shieldModel;let ennemy_ssModel;

        bulletModel = new THREE.Object3D()

        this.modelManager.forEach((e) => {

            if(e.name == "SpaceShip")  playerModel = e;

            if(e.name == "SpaceRock")  rockModel = e;

            if(e.name == "Bullet")  bulletModel.add(e);

            if(e.name == "ShieldItem") shieldModel = e;

            if(e.name == "HeartItem"){

                e.children[0].name = "Heart"
                heartModel = e;

            }  

            if(e.name == "CoinItem")  coinModel = e

            if(e.name == "ArrowItem") arrowModel = e

            if(e.name == "EnnemySpaceship") ennemy_ssModel = e

        })

        const audio = {

            audioManager : this.audioManager,
            sound :  this.sound,
            listener: this.listener

        }

        this.params = {

            goal: this.goal,
            camera:this.camera,
            follow: this.follow,

            scene: this.scene,
            
        }

        const utils = {

            renderer : this.renderer,
            scene : this.scene,
            camera : this.camera,

        }

        const animations = {
            mixer : null/*this.animationsManager[0]*/,
            idleAction : null/* this.idleAction*/,
        }

        const models = {

            player : new Player(this.params, playerModel,audio),
            ennemy_ss : new EnnemySpaceship(this.scene, ennemy_ssModel),
            asteroid : new BasicAsteroid(this.scene,rockModel,0),
            heart :  new Heart(this.scene, heartModel,0),
            coin : new Coin(this.scene, coinModel,0),
            arrow : new Arrow(this.scene, arrowModel,0),
            shield: new Shield(this.scene, shieldModel,0),
            basicBullet : new BasicBullet(this.scene, bulletModel, audio),

        }

        this.gm = new GameManager(models, utils, animations, audio)
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


