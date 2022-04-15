import * as THREE from 'three';
import Timer from "../Timer/timer.js";

class SunShrinking { 

    constructor(parent) {

      this.parent = parent;

      this.isScaling = false;
      this.timer = new Timer();

      this.timer.TIME_LIMIT = 9;
      this.timer.startTimer();

      this.timeShrink = 0.025 * 100;
      this.nShrink = .025 * 1000;

      this.intensity= 1.2;
      this.intensityStep = 0.05;


    }
        
    InitComponent() {}
 
    Update(timeElapsed,timeInSecond) {
        let mesh =  this.parent.children.find(e => e.constructor.name == "Mesh");
     
        if(this.timer.timeLeft >3){
          console.log("1er part")
          this.intensity =  THREE.MathUtils.lerp(this.intensity,this.intensity +  this.intensityStep,0.4);

          mesh.material.uniforms[ 'time' ].value =  this.timeShrink * timeInSecond ;
          mesh.material.uniforms[ 'n' ].value =  this.nShrink *  timeInSecond  ;
          mesh.material.uniforms[ 'intensity' ].value =   this.intensity  ;

          mesh.scale.addScalar(-0.001);

        }

        if(this.timer.timeLeft <= 3 && this.timer.timeLeft >2 ){
          console.log("2eme part")
          mesh.material.uniforms[ 'time' ].value =  this.timeShrink * timeInSecond ;
          mesh.material.uniforms[ 'n' ].value =  this.nShrink *  timeInSecond  ;

        }

        if(this.timer.timeLeft <= 2){
          console.log("last")
          mesh.scale.addScalar(0.02);

          this.intensity =  THREE.MathUtils.lerp(this.intensity,this.intensity - this.intensityStep,0.9);
          mesh.material.uniforms[ 'time' ].value = this.timeShrink * timeInSecond ;
          mesh.material.uniforms[ 'n' ].value =  this.nShrink *  timeInSecond  ;
          if (this.intensity >= 1.2) mesh.material.uniforms[ 'intensity' ].value = this.intensity  ;

        }

     //   
        

    }

  };

export default SunShrinking