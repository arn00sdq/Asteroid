class AsteroidMovement { 

    constructor(parent) {

      this.parent = parent;
      this.acceleration = new THREE.Vector3(1, 0.125, 2.0);
      this.velocity = new THREE.Vector3(0,0,0);

      this.TargetPosition = new THREE.Quaternion();
      this.TargetPosition.setFromAxisAngle(new THREE.Vector3(0, 1, 0),0);

      this.q1 = new THREE.Quaternion();
      this.q2 = new THREE.Quaternion();

    }
        
    InitComponent() {}

    Update(timeElapsed) {

      this.Subsomption(timeElapsed)

    }

    Subsomption(timeElapsed) {
      
      if(!this.Dodge(timeElapsed)){

          this.Move(timeElapsed);   

      }

  }

  //---- Regle de comportement

  Dodge(timeElapsed){

      let condition = this.PerceptObstacle();
      if (condition) this.Turn(timeElapsed);
      return condition;

  }

  //---- Percept

  PerceptObstacle(){

    let dodge = false;

    this.parent.scene.children.forEach((e) => {
        if(e.name == "Asteroid" && (e.uuid != this.parent.uuid) ){
            
            if (this.parent.position.distanceTo(e.position) < 1 ) dodge = true

        }

    });

    return dodge;

}

//---- Action

Move(timeElapsed){

  if(this.parent.children[0] !== null){

    this.parent.children[0].rotation.x = (this.parent.children[0].rotation.x + (Math.PI / 180) * 0.016 * 10 );
    this.parent.children[0].rotation.y = (this.parent.children[0].rotation.y + (Math.PI / 180) * 0.016 * 10 );
    this.parent.children[0].rotation.z = (this.parent.children[0].rotation.z + (Math.PI / 180) * 0.016 * 10);

  }

  let palier = Math.floor(timeElapsed / 4);
  this.parent.translateZ(0.01 * (this.parent.nbBreak*2) * ( (palier + 1) * 0.1 ) + 0.01 );

}
Turn(timeElapsed){

  let palier = Math.floor(timeElapsed / 4);
  this.parent.translateZ(0.01 * (this.parent.nbBreak*2) * ( (palier + 1) * 0.1 ) + 0.01 );
  let yAxis = new THREE.Vector3(0, 1, 0);
  
  this.TargetPosition.setFromAxisAngle(yAxis,  (Math.PI/90) * Math.random() * 1);
  this.q2.multiply(this.TargetPosition);
  this.parent.quaternion.slerp( this.q2,0.4)

}

  };

export default AsteroidMovement