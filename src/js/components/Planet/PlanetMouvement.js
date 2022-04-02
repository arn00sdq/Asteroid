class PlanetMouvement { 

    constructor(parent) {

      this.parent = parent;

    }
        
    InitComponent() {}

    Update(timeElapsed) {

      if(this.parent.children[0] !== null){

          this.parent.children[0].rotateY((Math.PI / 180) * 0.05);
        } 
        

    }

  };

export default PlanetMouvement