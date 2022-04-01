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

  }

  InitComponent() { }

  Update(timeInSeconds) {

    const TiS = 0.0016

    const input = this.parent.GetComponent('CharacterControllerInput');

    const velocity = this.velocity;

    const frameDecceleration = new THREE.Vector3(

      velocity.x * this.decceleration.x,
      velocity.y * this.decceleration.y,
      velocity.z * this.decceleration.z
    )

    frameDecceleration.multiplyScalar(0.016);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
      Math.abs(frameDecceleration.z), Math.abs(velocity.z));
    velocity.add(frameDecceleration);

    const controlObject = this.parent;
    const acc = this.acceleration.clone();

    if (input.keys.forward) {

      velocity.z += acc.z * TiS;
      controlObject.getWorldDirection(this.direction);
      this.direction_copy = this.direction.clone();

    }

    if (input.keys.shift) {

      velocity.z += acc.z * TiS;

    }
    this.temp = velocity;

    if (velocity.z > 0.035 && !input.keys.shift){

      this.temp = new THREE.Vector3(velocity.x,velocity.y,0.03);
      this.velocity.lerp(this.temp,1);

    }

    if (input.keys.backward) {

      velocity.z -= acc.z * TiS;

    }

    this.StaminaSystem(velocity,input,timeInSeconds);

    if (input.keys.left) {

      controlObject.rotateY((Math.PI/180) * 5);

    }
    if (input.keys.right) {

      controlObject.rotateY( - (Math.PI/180) * 5);

    }

    controlObject.position.add( this.direction.multiplyScalar(this.temp.z) );
    this.direction = this.direction_copy.clone();

    
  }

  StaminaSystem(velocity,input,timeInSeconds){

    if(this.stamina < 100 && !input.keys.shift) this.StaminaIncreased();

    if(input.keys.shift){

      if( this.startTime == null ) this.startTime  = timeInSeconds * 1000;
      this.StaminaConsumed(timeInSeconds);

    }else if(!input.keys.shift) this.startTime = null

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