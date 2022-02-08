class Component {
    constructor() {
        this.parent = null; // GameObject
      }
  
      SetParent(p) {
        this.parent = p;
      }
  
      InitComponent() {}
  
      GetComponent(n) {
        return this.parent.GetComponent(n);
      }
  
      Update() {}

};

export default Component