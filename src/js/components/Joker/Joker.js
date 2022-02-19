class Joker extends THREE.Group{

    constructor(scene, jokerItems){

        super();

        this.jokerItems = jokerItems;
        this.name = "Joker"
        
        
        this.scene = scene;
        this.InitComponent();

    }

    InitComponent() {}

    InitMesh(scale){
        
        this.add(this.jokerItems);

        this.children[0].scale.copy(scale)
        this.SetRigidBoby(this.children[0]);
        
    }  

    SetRigidBoby(object){

        object.geometry.computeBoundingBox();
        object.geometry.computeBoundingSphere();

        object.BB = new THREE.Box3().copy( object.geometry.boundingBox );
        object.BS = new THREE.Sphere().copy( object.geometry.boundingSphere );

    }

    Instantiate(o,p,r,s){
        
        o.position.copy(p);
        o.rotation.copy(r);
        o.scale.copy(new THREE.Vector3(s,s,s))

        this.scene.add(o);
        
    }

    Destroy(object){
       
        this.scene.remove(object);
        object.mesh = null;
    }
    Update(){}

}

export default Joker