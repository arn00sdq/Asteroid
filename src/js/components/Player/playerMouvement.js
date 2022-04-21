import * as THREE from 'three';

class CharacterMouvement { 

  constructor(parent) {

    this.parent = parent;
    this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -0.3);
    this.acceleration = new THREE.Vector3(0.08, 0.02, 0.2);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = 0.0;
    this.temp = new THREE.Vector3();

    this.stamina = 100;
    this.stamina_consumed = 40;//par seconde
    this.stamina_regain = 10;
    this.startTime = null;

    this.direction = new THREE.Vector3;
    this.direction_copy = new THREE.Vector3;

    /* anim */
    
    this.uniformZ = 50;
    this.uniformX = 70;

    this.uniformStepZ = 40;
    this.uniformStepX = 60;

    this.uniformDownStep = 0.3 ;
    this.uniformDownStepBackWard = 3 ;

  }

  InitComponent() { }

  oscillate(input, min, max) {
    var range = max - min;
    return min + Math.abs(((input + range) % (range * 2)) - range);
  }

  Update(timeElapsed) {

    
    const TiS = 0.0016;
    const booster = this.parent.children.find( e =>e.name =="booster" )
    const input = this.parent.GetComponent('CharacterControllerInput');
    const velocity = this.velocity;
    const controlObject = this.parent;
    const acc = this.acceleration.clone();

    const frameDecceleration = new THREE.Vector3(
      velocity.x * this.decceleration.x,
      velocity.y * this.decceleration.y,
      velocity.z * this.decceleration.z
    )

    frameDecceleration.multiplyScalar(0.016);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
      Math.abs(frameDecceleration.z), Math.abs(velocity.z));
    velocity.add(frameDecceleration);
    
    let bp = this.oscillate(timeElapsed,0.03,0.09);
    booster.material.uniforms[ 'boostPower' ].value = bp;

    if (input.keys.forward) {

      velocity.z += acc.z * TiS;
      controlObject.getWorldDirection(this.direction);
      this.direction_copy = this.direction.clone();

     // let os = this.oscillate(timeElapsed *50,0.03,0.09);
      if (!input.keys.shift) this.BoosterMode("forward",booster)

    }else{

      this.BoosterMode("freeWheel",booster)

    }

    if (input.keys.shift) {

      velocity.z += acc.z * TiS;
      this.BoosterMode("acceleration",booster);

    }

    this.temp = velocity;
    this.StaminaSystem(velocity,input,timeElapsed);

    if (input.keys.backward) {

      velocity.z -= acc.z * TiS;
      this.BoosterMode("brake",booster);

    }

    if (input.keys.left) {

      controlObject.rotateY((Math.PI/180) * 3);

    }
    if (input.keys.right) {

      controlObject.rotateY( - (Math.PI/180) * 3);

    }

    controlObject.position.add( this.direction.multiplyScalar(this.temp.z) );
    
    this.direction = this.direction_copy.clone();

    
  }

  BoosterMode(mode,booster){

    switch (mode){

      case "forward":

        this.uniformZ =  THREE.MathUtils.lerp(this.uniformZ,this.uniformZ + this.uniformStepZ,0.01);
        this.uniformX =  THREE.MathUtils.lerp(this.uniformX,this.uniformX + this.uniformStepX,0.01);
  
        if(this.uniformZ >  80) this.uniformZ =  100
        if(this.uniformX > 140) this.uniformX = 140

        booster.material.uniforms[ 'time' ].value = 0.05;
        break;

      case "acceleration":

        this.uniformZ =  THREE.MathUtils.lerp(this.uniformZ,this.uniformZ + this.uniformStepZ,0.05);
        this.uniformX =  THREE.MathUtils.lerp(this.uniformX,this.uniformX + this.uniformStepX,0.05);
  
        if(this.uniformZ >  120) this.uniformZ =  120
        if(this.uniformX > 200) this.uniformX = 200

        booster.material.uniforms[ 'time' ].value = 0.05;
        break;
      case "brake":

        this.uniformZ -= this.uniformDownStepBackWard;
        this.uniformX -= this.uniformDownStepBackWard;
    
        if(this.uniformX < 70) this.uniformX = 70;
        if(this.uniformZ < 50) this.uniformZ = 50;

        break;
      case "freeWheel":

        this.uniformZ -= this.uniformDownStep;
        this.uniformX -= this.uniformDownStep;
    
        if(this.uniformX < 70) this.uniformX = 70;
        if(this.uniformZ < 50) this.uniformZ = 50;

        break;

    }

    booster.material.uniforms[ 'uniformZ' ].value = this.uniformZ;
    booster.material.uniforms[ 'uniformX' ].value = this.uniformX;

  }

  StaminaSystem(velocity,input,timeElapsed){
    
    if(!input.keys.shift){

      if(this.stamina < 100) this.StaminaIncreased();

      if(velocity.z > 0.035){

        this.temp = new THREE.Vector3(velocity.x,velocity.y,0.03);
        this.velocity.lerp(this.temp,1);

      }

      this.startTime = null;

    }else{

      if(this.stamina != 0){

        if( this.startTime == null ) this.startTime  = timeElapsed * 1000;

        this.StaminaConsumed(timeElapsed);

      }else{

        this.temp = new THREE.Vector3(velocity.x,velocity.y,0.03);
        this.velocity.lerp(this.temp,1);

      }

    }

  }

  StaminaConsumed(timeElapsed){

    this.stamina -= this.stamina_consumed /60;
    if(this.stamina < 0) this.stamina=  0;
    
    document.getElementById("endurance").style.width = this.stamina +"%";
    document.getElementById("stamina").innerHTML = Math.round(this.stamina);

  }

  StaminaIncreased(){

    this.stamina += this.stamina_regain /60;
    if(this.stamina > 100) this.stamina =  100;
    document.getElementById("endurance").style.width = this.stamina +"%";
    document.getElementById("stamina").innerHTML = Math.round(this.stamina);

  }

};

export default CharacterMouvement