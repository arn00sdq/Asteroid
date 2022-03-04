import Player from "./components/Player/Player.js";
import BasicBullet from "./components/Bullet/BasicBullet.js";
import BasicAsteroid from "./components/Asteroid/BasicAsteroid.js";
import GameManager from "./components/GameSystem/GameManager.js";

import {OBJLoader} from "./Loader/OBJLoader.js"
import { Object3D, TextureLoader } from "./three/three.module.js";
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
        this.camera.fov = 112.5
        
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
        this.follow.name = "FollowPlayer"
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
        
        /* 
        * texture
        */

        const textureLoader = new TextureLoader(this.loadingManager);

        var mapPlayer = textureLoader.load('../medias/models/Player/textures/Andorian (4).png');
        var normalPlayer1 = textureLoader.load('../medias/models/Player/textures/Andorian (3).png');
        var normalPlayer2 = textureLoader.load('../medias/models/Player/textures/Husnock (3).png');
        var envPlayer = textureLoader.load('../medias/models/Player/textures/env.png');
        var materialPlayer = new THREE.MeshPhongMaterial({
            map:mapPlayer, 
            normalMap: normalPlayer1, 
            bumpMap:normalPlayer2, 
            emissiveMap:envPlayer,
        });

        var mapBullet = textureLoader.load('../medias/models/bullet/obj/textures/bullet.png');
        var materialBullet = new THREE.MeshPhongMaterial({map:mapBullet});

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

        const materialArrow = new THREE.MeshLambertMaterial( );
        
        materialArrow.color.set(0x0000ff)
        materialArrow.emissive.set(0xd000ff)


        const cylinderMesh = new THREE.Mesh( geometryAsteroid, materialAsteroid);
        cylinderMesh.name="BulletEnnemy";
        cylinderMesh.rotateX( (Math.PI / 180) *90 );

        const ArrowMesh = new THREE.Mesh( geometryAsteroid, materialArrow);
        ArrowMesh.name="ArrowItem";
        ArrowMesh.rotateZ( (Math.PI / 180) * 25);

        /* 
        * ModelManager
        */
        this.modelManager.push(cylinderMesh); this.modelManager.push(ArrowMesh);

        loaderObj.load('../medias/models/low_poly.obj',  ( object ) => {

            object.traverse( function ( child ) {

                if ( child.isMesh ) child.material = material;
            
            } );

            object.name="SpaceRock";
            this.modelManager.push(object);
           
        }); 

        loaderObj.load('../medias/models/bullet/obj/rocket.obj',  ( object ) => {

            object.traverse( function ( child ) {

                if ( child.isMesh ) child.material = materialBullet;
            
            } );

            object.name="Bullet";
            
            this.modelManager.push(object);
           
        }); 

        loaderObj.load('../medias/models/Ennemy/ennemy_ss.obj',  ( object ) => {

            object.traverse( function ( child ) {

                if ( child.isMesh ) child.material = materialEnnemySS;
            
            } );

            object.children[0].rotateY( (Math.PI / 180) *180 );
            object.name="EnnemySpaceship";
            this.modelManager.push(object);

        });

        loaderObj.load('../medias/models/explosion.obj',  ( object ) => {

            object.name="Explosion";
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

       /* loaderObj.load("../medias/models/bullet/obj/rocket.obj", (object) => {
/
            object.name="ArrowItem";
            this.modelManager.push(object)
            
        });*/
        
        loaderObj.load('../medias/models/Player/SpaceShip.obj',  (object) => {

            object.traverse( function ( child ) {

                if ( child.isMesh ) child.material = materialPlayer;
            
            });

            object.name="SpaceShip";
            this.modelManager.push(object);

        }); 
        
    }

    LoadAudio(){

        this.audioManager = [];

        this.sound = new THREE.Audio( this.listener );

        const audioLoader = new THREE.AudioLoader(this.loadingManager);
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
         let shieldModel;let ennemy_ssModel; 

        let bulletEnnemy = new Object3D();
        let arrowModel = new Object3D();
        this.modelManager.forEach((e) => {

            if(e.name == "SpaceShip")  playerModel = e;

            if(e.name == "SpaceRock") rockModel = e

            if(e.name == "Bullet")  bulletModel = e;

            if(e.name == "BulletEnnemy")  bulletEnnemy.add(e);

            if(e.name == "ShieldItem") shieldModel = e;

            if(e.name == "HeartItem") heartModel = e;

            if(e.name == "CoinItem")  coinModel = e;

            if(e.name == "ArrowItem") arrowModel.add(e);

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
            coin : new Coin(this.scene, coinModel,0),
            arrow : new Arrow(this.scene, arrowModel,0),
            shield: new Shield(this.scene, shieldModel,0),
            heart :  new Heart(this.scene, heartModel,0),
            basicBullet : new BasicBullet(this.scene, bulletModel, audio),
            ennemyBullet: new BasicBullet(this.scene, bulletEnnemy, audio),

        }

        models.player.add(  this.params.follow)

        this.gm = new GameManager(models, utils, animations, audio)
        this.gm.ModelInitialisation(); 
        this.gm.ValueInitialisation(); 

        this.remove = null ;

        this.renderer.render(this.scene, this.camera);

        document.addEventListener('keydown',  this.remove =  this.OnPlayerBegin.bind(this))
        document.addEventListener( 'mousewheel',  this.OnMouseWheel.bind(this) ,false );

    }

    OnPlayerBegin( event ) {

        
        if (event.code == 'Space') {

            document.getElementById("start_game").style.display = "none";
            document.removeEventListener('keydown',  this.remove);
           
            this.gm.GetComponent("LevelSystem").StartLevel();
        }

    }

    OnMouseWheel(event){

    var fovMAX = 160;
    var fovMIN = 1;
    this.camera.fov -= event.wheelDeltaY * 0.05;
    this.camera.fov = Math.max( Math.min( this.camera.fov, fovMAX ), fovMIN );
    this.camera.updateProjectionMatrix();
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


