import * as THREE from 'three';

class GameObject extends THREE.Object3D{

    /**
    *
    * @param {THREE.Object3D}  model 
    * @param {THREE.Mesh}  audio
    * @param {THREE.Audio} [params] 
    */
    constructor(model, audio){
        
        super();
        
        if (!model) model = "";
        if (!audio) audio = "";

        this.components = {};
        this.model = model;

        this.scene = null;
        this.name = null;
        this.audio = audio;
        this.nb = 0;
        this.limit = 0;

    }

    /**
    *- Ajoute la mesh et definit le scale
    * @param {THREE.Vector3}  scale 
    */
    InitMesh(scale){
    
        this.model.children.forEach( (e) => {

            this.add(e)

        })

       // this.children[0].scale.copy(scale)
        
    }  

    /**
    *- Ajoute une box3 
    * @param {THREE.Object3D}  object
    */
    SetRigidBody(object){

        object.userData.box3 = new THREE.Box3()
        
    }

    /**
    * Enleve la box3 
    * @param {}  object 
    */
    RemoveRigidBody() {

        this.userData.box3 = null;

    }
    
    /** 
    * @param {Number}  seconds Temps en seconde durant la box3 est retirée
    **/
    SetInvulnerability(seconds){

        this.userData.box3 = null;

       if(this.children[0]){

            setTimeout(() => {

                this.userData.box3 = new THREE.Box3()

            }, seconds);

       } 

    }

    /**
    * - Ajoute l'objet à la scène 
    * @param {THREE.Object3D}  o Object3D du modèle
    * @param {THREE.Vector3}  p position du modèle à instancier
    * @param {THREE.Euler}  r rotation du modèle à instancier
    * @param {THREE.Scene}  s scène courante
    */
    Instantiate(o,p,r,s){
        
        o.position.copy(p);
        o.rotation.copy(r);
        o.children.forEach( e => {
            if (e.constructor.name == "Mesh") {
                
                e.scale.copy(new THREE.Vector3(s,s,s))
            }
        })

        this.scene.add(o);
        
    }

    /**
    *- Ajoute l'objet à la scène et le retire au bout de x seconds 
    * @param {THREE.Object3D}  o
    * @param {THREE.Vector3}  p
    * @param {THREE.Euler}  r 
    * @param {THREE.Scene}  s 
    */
    InstantiateAndDestroy(o,p,r,s,t){
        
        this.Instantiate(o,p,r,s)

        setTimeout(() => {

            this.Destroy(o)

        }, t);


    }

    /**
    *- Enleve l'objet de la scène 
    * @param {THREE.Object3D}  o Enleve l'objet de la scène
    */
    Destroy(object){

        object.mesh = null;
       
        this.scene.remove(object);
            
    }

    /**
    *- Ajout du composant au modele 
    * @param {THREE.Object3D}  c 
    */
    AddComponent(c) {

        this.components[c.constructor.name] = c;  

    }

    /**
    *- Enleve le composant du modele 
    * @param {THREE.Object3D}  c 
    */
    RemoveComponent(c) {

        delete this.components[c];  

    }

    /**
    * Retourne le composant
    * @param {THREE.Object3D}  c 
    */
    GetComponent(n) {

        return this.components[n];

    }

    /**
    * temps en seconde
    * @param {Number}  timeElapsed 
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