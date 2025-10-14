const mongoose = require('mongoose');
 

const CompteShemas = new mongoose.Schema({
    nom: {
        type: String,
        required: true
      },
      prenom: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      mdp: {
        type: String,
        required: true
      },
      cni: {
        type: String,
        required: true
      },
      pathPhoto: {
        type:String,
        
      },


});
module.exports = mongoose.model('compte', CompteShemas);