class AsteroidMovement { 

    constructor(parent) {

      this.parent = parent;
      this.acceleration = new THREE.Vector3(1, 0.125, 2.0);
      this.velocity = new THREE.Vector3(0,0,0);

      this.shift = new THREE.Vector3();
      this.clock = new THREE.Clock();
      this.delta = null;

      this.isBigger = false;
      this.direction = null;
      this.directionToTurn = new THREE.Vector3();

    }
        
    InitComponent() {

      this.direction = new THREE.Vector3(Math.random() * 2 - 1,0,Math.random() * 2 - 1).normalize();

    }

    Update(timeElapsed) {

      this.delta = this.clock.getDelta();
      this.customvitesse = (1 + (1/ (this.parent.scale.x))/100);
      this.palier = 1 + ((Math.floor(timeElapsed / 3) + 1) * 0.01 );
      this.Subsomption(timeElapsed);

    }

    Subsomption(timeElapsed) {
      
      if(this.Dodge(timeElapsed)){

          this.Move(timeElapsed);   

      }

  }

  //---- Regle de comportement

  Dodge(timeElapsed){

      let condition = this.PerceptObstacle();
      if (!this.isBigger) this.Turn(timeElapsed);
      return condition;

  }

  //---- Percept

  PerceptObstacle(){

    this.parent.scene.children.forEach((e) => {

        if(e.name == "Asteroid" && (e.uuid != this.parent.uuid) ){
            
            if (this.parent.position.distanceTo(e.position) < 2 ){

              if (this.parent.scale.x <= e.scale.x){

                this.isBigger = false;
                this.directionToTurn = e.GetComponent("AsteroidMovement").direction;

              }else{

                this.isBigger = true;

              }

            } 
        }
    });

    return this.isBigger;

}

  //---- Action

  Move(timeElapsed){

    if(this.parent.children[0] !== null){

      this.parent.children[0].rotation.x = (this.parent.children[0].rotation.x + (Math.PI / 180) * 0.016 * 10 );
      this.parent.children[0].rotation.y = (this.parent.children[0].rotation.y + (Math.PI / 180) * 0.016 * 10 );
      this.parent.children[0].rotation.z = (this.parent.children[0].rotation.z + (Math.PI / 180) * 0.016 * 10);

    }

    this.shift.copy(this.direction).multiplyScalar(this.delta * 1 * this.customvitesse * this.palier );
    this.parent.position.add(this.shift);


  }
  Turn(timeElapsed){

    this.direction.lerp(this.directionToTurn,0.01)
    this.shift.copy(this.direction).multiplyScalar(this.delta * 1 * this.customvitesse * this.palier);
    this.parent.position.add(this.shift);

  }

  };

export default AsteroidMovement