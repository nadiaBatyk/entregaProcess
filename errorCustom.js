class ErrorCustom extends Error {
    status;
    
    constructor(message , status, name) {
      super(message);
      this.status = status;
      this.name=name;
    }
  }
  module.exports = ErrorCustom;