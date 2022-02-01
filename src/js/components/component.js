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
  
      FindEntity(n) {
        return this.parent.FindEntity(n);
      }
  
      Broadcast(m) {
        this.parent.Broadcast(m);
      }
  
      Update() {}
  
      RegisterHandler(n, h) {
        this.parent.RegisterHandler(n, h);
      }
};

export default Component