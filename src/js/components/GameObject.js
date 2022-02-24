class GameObject extends THREE.Object3D{

    constructor(scene, model){

        super();

        this.components = {};
        this.model = model;
        this.scene = scene;
        this.name = null;

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
    SetRigidBoby(object){

        object.geometry.computeBoundingBox();
        object.geometry.computeBoundingSphere();

        this.BB = new THREE.Box3().copy( object.geometry.boundingBox );
        this.BS = new THREE.Sphere().copy( object.geometry.boundingSphere );

    }

    /**
    * @param {THREE.Object3D}  object Object3D du modèle
    */
    RemoveRigidBody(object) {

        object.BB = null;
        object.BS = null;

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
    * @param {Number}  timeElapsed temps en seconde
    */
    Update(timeElapsed){

        if(this.children[0] !== null){   

            for (let k in this.components) {

                this.components[k].Update(timeElapsed);
            }
        }

    }

}

export default GameObject