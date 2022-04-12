import * as THREE from 'three';

class ExplosionMouvement { 

    constructor(parent) {

      this.parent = parent;
      this.growTimeStep =  0.05;
      this.growTime = 0;

    }
        
    InitComponent() {}

    Update(timeElapsed,timeInSecond) {

        let mesh =  this.parent.children.find(e => e.constructor.name == "Mesh")
        this.growTime =  THREE.MathUtils.lerp(this.growTime,this.growTime +  this.growTimeStep,0.4);
        mesh.material.uniforms[ 'time' ].value = 0.025 *  timeInSecond * 1000 ;

        if(this.growTime > .8){

          this.growTime = .8

          mesh.material.uniforms[ 'opacity' ].value -=   timeElapsed * 2  ;
          if(mesh.material.uniforms[ 'opacity' ].value <= 0) this.parent.Destroy(this.parent)
          
        }else{

          mesh.material.uniforms[ 'growTime' ].value =   this.growTime  ;

        }

    }

  };

export default ExplosionMouvement