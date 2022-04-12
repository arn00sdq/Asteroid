import * as THREE from 'three';

class SpecialBulletAnim{

    constructor(parent){

        this.parent = parent;
    
        this.speed = 0.1;

    }

    Start(){}

    Update(timeElapsed,timeInSecond){
        
        let mesh =  this.parent.children.find(e => e.constructor.name == "Mesh")
       
        mesh.material.uniforms[ 'time' ].value = 0.025 *  timeInSecond * 1000 ;


    }

};

export default SpecialBulletAnim