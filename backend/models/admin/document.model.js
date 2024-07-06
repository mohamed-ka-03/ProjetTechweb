module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      nomDocument: String,
      typeDocument: String,
      champsDynamiques: [
        {
          label: String,
          valeur: [mongoose.Schema.Types.Mixed] , // Utilisation de Mixed pour prendre en charge différents types de données
        }
       
      ],
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Document = mongoose.model("Document", schema);
  return Document;
};
