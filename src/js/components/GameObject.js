class GameObject extends THREE.Object3D{

    constructor(scene, model, audio){
        
        super();

        if (!audio) audio = null;
        
        this.components = {};
        this.model = model;
        this.scene = scene;
        this.name = null;
        this.audio = audio;
        this.nb = 0;
        this.limit = 0;

    }

    /**
    * @param {THREE.Vector3}  scale Scale de l'object
    */
    InitMesh(scale){

        this.add(this.model);

        this.children[0].scale.copy(scale)
        
    }  

    /**
    * @param {THREE.Object3D}  object Object3D du modèle
    */
    SetRigidBody(object){

        object.userData.box3 = new THREE.Box3()
        
     //   console.log(object.name, object.userData)

    }

    /**
    * @param {THREE.Object3D}  object Object3D du modèle
    */
    RemoveRigidBody(object) {

       /* object.BB = null;
        object.BS = null;*/

    }
    
    /** 
    * @param {Number}  seconds temps en seconde
    **/
    SetInvulnerability(seconds){

        this.userData.box3 = null;
        this.userData.box3 = null;

       if(this.children[0]){

            setTimeout(() => {

                this.userData.box3 = new THREE.Box3()

            }, seconds);

       } 

    }

    /**
    * @param {THREE.Object3D}  o Object3D du modèle
    * @param {THREE.Vector3}  p position du modèle à instancier
    * @param {THREE.Euler}  r rotation du modèle à instancier
    * @param {THREE.Scene}  s scène courante
    */
    Instantiate(o,p,r,s){
        
        o.position.copy(p);
        o.rotation.copy(r);
        o.scale.copy(new THREE.Vector3(s,s,s))
        this.scene.add(o);
        
    }

    /**
    * @param {THREE.Object3D}  o Object3D du modèle
    * @param {THREE.Vector3}  p position du modèle à instancier
    * @param {THREE.Euler}  r rotation du modèle à instancier
    * @param {THREE.Scene}  s scène courante
    * @param {Number}  s temps en seconde
    */
    InstantiateAndDestroy(o,p,r,s,t){
        
        this.Instantiate(o,p,r,s)

        setTimeout(() => {

            this.Destroy(o)

        }, t);


    }

    /**
    * @param {THREE.Object3D}  o Object3D du modèle
    */
    Destroy(object){

        object.mesh = null;
       
        this.scene.remove(object);
            
    }

    /**
    * @param {THREE.Object3D}  c Composant du modele
    */
    AddComponent(c) {

        this.components[c.constructor.name] = c;  

    }

    /**
    * @param {THREE.Object3D}  c Composant du modele
    */
    GetComponent(n) {

        return this.components[n];

    }

    /**
    * @param {Number}  timeElapsed temps en seconde
    */
    Update(timeElapsed){

        if (this.userData.box3 !==null &&  this.userData.box3) this.userData.box3.setFromObject(this)
        
        if(this.children[0] !== null){   

            for (let k in this.components) {
                
                this.components[k].Update(timeElapsed);
            }
        }

    }

}

export default GameObject