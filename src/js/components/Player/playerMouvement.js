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
    
    this.boostLengthZ = 50;
    this.boostLengthX = 70;

    this.boostLengthStepZ = 40;
    this.boostLengthStepX = 60;

    this.boostLengthDownStep = 0.3 ;
    this.boostLengthDownStepBackWard = 3 ;

  }

  InitComponent() { }

  oscillate(input, min, max) {
    var range = max - min;
    return min + Math.abs(((input + range) % (range * 2)) - range);
  }

  Update(timeInSeconds) {

    
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
    
    let bp = this.oscillate(timeInSeconds *0.01,0.03,0.09);
    booster.material.uniforms[ 'boostPower' ].value = bp;

    if (input.keys.forward) {

      velocity.z += acc.z * TiS;
      controlObject.getWorldDirection(this.direction);
      this.direction_copy = this.direction.clone();

      let os = this.oscillate(timeInSeconds *50,0.03,0.09);
      if (!input.keys.shift) this.BoosterMode("forward",booster)

    }else{

      this.BoosterMode("freeWheel",booster)

    }

    if (input.keys.shift) {

      velocity.z += acc.z * TiS;
      this.BoosterMode("acceleration",booster);

    }

    this.temp = velocity;
    this.StaminaSystem(velocity,input,timeInSeconds);

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

        this.boostLengthZ =  THREE.MathUtils.lerp(this.boostLengthZ,this.boostLengthZ + this.boostLengthStepZ,0.01);
        this.boostLengthX =  THREE.MathUtils.lerp(this.boostLengthX,this.boostLengthX + this.boostLengthStepX,0.01);
  
        if(this.boostLengthZ >  80) this.boostLengthZ =  100
        if(this.boostLengthX > 140) this.boostLengthX = 140

        booster.material.uniforms[ 'time' ].value = 0.05;
        break;

      case "acceleration":

        this.boostLengthZ =  THREE.MathUtils.lerp(this.boostLengthZ,this.boostLengthZ + this.boostLengthStepZ,0.05);
        this.boostLengthX =  THREE.MathUtils.lerp(this.boostLengthX,this.boostLengthX + this.boostLengthStepX,0.05);
  
        if(this.boostLengthZ >  120) this.boostLengthZ =  120
        if(this.boostLengthX > 200) this.boostLengthX = 200

        booster.material.uniforms[ 'time' ].value = 0.05;
        break;
      case "brake":

        this.boostLengthZ -= this.boostLengthDownStepBackWard;
        this.boostLengthX -= this.boostLengthDownStepBackWard;
    
        if(this.boostLengthX < 70) this.boostLengthX = 70;
        if(this.boostLengthZ < 50) this.boostLengthZ = 50;

        break;
      case "freeWheel":

        this.boostLengthZ -= this.boostLengthDownStep;
        this.boostLengthX -= this.boostLengthDownStep;
    
        if(this.boostLengthX < 70) this.boostLengthX = 70;
        if(this.boostLengthZ < 50) this.boostLengthZ = 50;

        break;

    }

    booster.material.uniforms[ 'boostLengthZ' ].value = this.boostLengthZ;
    booster.material.uniforms[ 'boostLengthX' ].value = this.boostLengthX;

  }

  StaminaSystem(velocity,input,timeInSeconds){
    
    if(!input.keys.shift){

      if(this.stamina < 100) this.StaminaIncreased();

      if(velocity.z > 0.035){

        this.temp = new THREE.Vector3(velocity.x,velocity.y,0.03);
        this.velocity.lerp(this.temp,1);

      }

      this.startTime = null;

    }else{

      if(this.stamina != 0){

        if( this.startTime == null ) this.startTime  = timeInSeconds * 1000;

        this.StaminaConsumed(timeInSeconds);

      }else{

        this.temp = new THREE.Vector3(velocity.x,velocity.y,0.03);
        this.velocity.lerp(this.temp,1);

      }

    }

  }

  StaminaConsumed(timeInSeconds){

    this.stamina -= this.stamina_consumed /60;
    if(this.stamina < 0) this.stamina=  0;
    
    document.getElementById("endurance").style.width = this.stamina +"%";

  }

  StaminaIncreased(){

    this.stamina += this.stamina_regain /60;
    if(this.stamina > 100) this.stamina =  100;
    document.getElementById("endurance").style.width = this.stamina +"%";

  }

};

export default CharacterMouvement