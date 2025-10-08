const mongoose = require('mongoose');

const  extrait = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenoms: {
    type: String,
    required: true
  },
  dateNaissance: {
    type: Date,
    required: true
  },
  lieuNaissance: {
    type: String,
    required: true
  },
  nomPere: {
    type: String,
    required: true
  },
  prenomsPere: {
    type: String,
    required: true
  },
  nomMere: {
    type: String,
    required: true
  },
  prenomsMere: {
    type: String,
    required: true
  },
  sexe: {
    type: String,
    enum: ['Masculin', 'Féminin'],
    required: true
  },
  numeroIdentification: {
    type: String,
    unique: true,
    required: true
  },
  cni: {
    type: String,
    unique: true,
    required: true
  },  
  dateDelivrance: {
    type: Date,
    required: true
  },
  lieuDelivrance: {
    type: String,
    required: true
  },
  
  signatureOfficierEtatCivil: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('extrait', extrait);