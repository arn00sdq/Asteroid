import * as THREE from 'three';

class BulletMouvement{

    constructor(parent){

        this.parent = parent;
        
        this.velocity = new THREE.Vector3();
        this.forward = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.speed = 0.1;

    }

    Start(){}

    Update(timeElapsed){
        
        let palier = timeElapsed / 7;

        this.forward.set(0, 0, 1);
        this.forward.applyQuaternion(this.parent.quaternion);

        this.forward.normalize();
        this.forward.multiplyScalar(this.velocity.z * 0.1);

        this.parent.position.add(this.forward)


    }

};

export default BulletMouvement