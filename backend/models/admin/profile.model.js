 

module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        // name: String,
        // course: String,
        // registered: Boolean,
        id: String,
        email: String,
        mdp: String,
        fonction: String,

    
 
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function () {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const profiles = mongoose.model("profiles", schema);
    return profiles;
  };
  