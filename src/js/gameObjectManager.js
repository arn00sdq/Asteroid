class GameObjectManager extends THREE.Object3D{
    constructor() {
      super();
      this.ids = 0;
      this.entitiesMap = {};
      this.entities = [];
    }

    _GenerateName() {
      this.ids += 1;
      return '__name__' + this.ids;
    }

    Get(n) {
      return this.entitiesMap[n];
    }

    Filter(cb) {
      return this.entities.filter(cb);
    }

    Add(e, n) {
      if (!n) {
        n = this._GenerateName();
      }

      this.entitiesMap[n] = e;
      this.entities.push(e);

      e.SetParent(this);
      e.SetName(n);
    }

    SetActive(e, b) {
      const i = this.entities.indexOf(e);
      if (i < 0) {
        return;
      }

      this.entities.splice(i, 1);
    }

    Update(timeElapsed) {
      for (let e of this.entities) {
        e.Update(timeElapsed);
      }
    }
  }

  export default GameObjectManager