 

module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        // name: String,
        // course: String,
        // registered: Boolean,
        id: String,
        nomStructure: String,
        address: String,
  
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function () {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const structures = mongoose.model("structures", schema);
    return structures;
  };
  