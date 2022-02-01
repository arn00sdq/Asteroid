import BulletMesh from './components/BulletMesh.js'
//import PlayerShootProjectiles from './components/PlayerShootProjectiles'

class GameObject extends THREE.Object3D{ 
    constructor(name,params) {
        super();
        this.name = name;
        this.components = {}; 
        this.handlers = {};
        this.parent = null;
        this.params = params;
    }

    SetParent(p) {
        this.parent = p;
    }

    SetName(n) {
        this.name = n;
    }
    GetName(){
        return this.name;
    }

    AddComponent(c) {
        c.SetParent(this);
        this.components[c.constructor.name] = c
         c.InitComponent();         
    }

    GetComponent(n) {
        return this.components[n];
    }

    Instantiate(object, position, rotation){        
        const cloneObject = object.clone();
        cloneObject.params = object.params;
        switch(object.name){ // clone ne marche pas avec les field rajoutés
            case "BasicBullet":
                cloneObject.AddComponent(new BulletMesh.BulletMesh());
                let tab = this.GetComponent('PlayerShootProjectiles');
                tab.bulletTab.push(cloneObject);
                break;
        }
        cloneObject.position.copy(position);
        cloneObject.rotation.copy(rotation); 
        this.parent.Add(cloneObject,object.name)
    }

    SetPosition(p) {
        this.position.copy(p);
    }
      
    SetQuaternion(r) {
        this.rotation.copy(r);
    }
      
    Update(timeElapsed) {
        for (let k in this.components) {
          this.components[k].Update(timeElapsed);
         }
     }
}

export default GameObject
