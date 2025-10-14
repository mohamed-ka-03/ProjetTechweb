const mongoose = require('mongoose');

const demandeSchema = new mongoose.Schema({
  nomDemandeur: {
    type: String,
    required: true
  },
  prenomsDemandeur: {
    type: String,
    required: true
  },
  emailDemandeur: {
    type: String,
    required: true
  },
  telephoneDemandeur: {
    type: String,
    required: true
  },
  adresseDemandeur: {
    type: String,
    required: true
  },
  typeDocument: {
    type: String,
    required: true
  },
  numeroIdentification: { type: String },
  dateDemande: {
    type: Date,
    default: Date.now
  },
  etatDemande: {
    type: String,
    enum: ['en attente', 'en cours', 'terminé','rejetée'], // Include 'terminé' if not already present
    default: 'en attente' // Set a default value if needed
  },
  pdfPath: { type: String }
});

module.exports = mongoose.model('demande', demandeSchema);