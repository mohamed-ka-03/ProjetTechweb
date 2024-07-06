const db = require("../models");

const Document = db.documents;
const Structure = db.structures;
const Profile = db.profiles;
const Demande = require('../models/demande.model'); 


//-------------------------------------document----------------------------------------------
exports.created = async (req, res) => {
  // Valider la requête
  if (!req.body || !req.body.nomDocument || !req.body.typeDocument  ) {
    return res.status(400).send({ message: "Le contenu ne peut pas être vide !" });
  }

  try {
    // Créer un nouveau document
    const document = new Document({
      nomDocument: req.body.nomDocument,
      typeDocument: req.body.typeDocument,
      champsDynamiques: req.body.champsDynamiques,
    });

    // Enregistrer le document dans la base de données
    const data = await document.save();

    // Répondre avec les données enregistrées
    res.status(201).send({
      message: "Document créé avec succès",
      document: data,
    });
  } catch (err) {
    console.error("Erreur lors de la création du document:", err);
    res.status(500).send({
      message: err.message || "Une erreur s'est produite lors de la création.",
    });
  }
};
exports.findAlld = async (req, res) => {
  try {
    const documents = await Document.find(); // Assurez-vous que Document est défini
    res.status(200).json(documents);
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deleted = async (req, res) => {
  const { id } = req.params;
  try {
    await Document.findByIdAndDelete(id);
    res.status(200).send({ message: 'Document supprimé avec succès' });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la suppression du document' });
  }
};

exports.updated = async (req, res) => {
  const { id } = req.params;
  const { nomDocument, typeDocument, champsDynamiques } = req.body; // Ajoutez champsDynamiques si nécessaire

  try {
    // Utilisation de findByIdAndUpdate pour mettre à jour la Document
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      { nomDocument, typeDocument, champsDynamiques }, // Incluez champsDynamiques si nécessaire
      { new: true }  
    );

    if (!updatedDocument) {
      return res.status(404).send({ message: "Document non trouvée avec l'ID fourni." });
    }

    res.status(200).send(updatedDocument); // Répondre avec la Document mise à jour
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la Document:', error.message);
    res.status(500).send({ message: 'Erreur lors de la mise à jour de la Document.' });
  }
};
exports.formEnregistrement = async (req, res) => {
  const { id, champsDynamiques } = req.body;
console.log(champsDynamiques)
  try {
    // Recherche du document par ID
    let document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Parcourir les champs dynamiques envoyés depuis le frontend
    champsDynamiques.forEach(champ => {
      // Vérifier si le champ dynamique existe déjà dans le document
      let existingChamp = document.champsDynamiques.find(c => c.label === champ.label);

      if (!existingChamp) {
        // Si le champ dynamique n'existe pas, l'ajouter au document
        document.champsDynamiques.push({ label: champ.label, valeur: champ.valeur });
      } else {
        // Si le champ dynamique existe, mettre à jour ses valeurs
        existingChamp.valeur = champ.valeur;
      }
    });

    // Enregistrer les modifications dans la base de données
    await document.save();

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.formread=async (req,res)=>{
  try {
    // Rechercher tous les documents
    const documents = await Document.find();

    if (!documents || documents.length === 0) {
      return res.status(404).json({ message: 'Aucun document trouvé' });
    }

    // Créer un objet pour stocker les labels avec leurs valeurs
    const labelsEtValeurs = {};

    // Parcourir chaque document pour récupérer les champs dynamiques
    documents.forEach(doc => {
      doc.champsDynamiques.forEach(champ => {
        const { label, valeur } = champ;

        // Si le label n'existe pas encore dans l'objet, l'initialiser comme un tableau vide
        if (!labelsEtValeurs[label]) {
          labelsEtValeurs[label] = [];
        }

        // Ajouter les valeurs au tableau correspondant au label
        labelsEtValeurs[label].push(...valeur);
      });
    });

    res.json(labelsEtValeurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//---------------------------------structure----------------------------------------------
exports.creates = function (req, res) {
  // Valider la requête
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Créer une nouvelle structure
  const structure = new Structure({
    nomStructure: req.body.nomStructure,
    address: req.body.address,
  });

  // Enregistrer la structure dans la base de données
  structure
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la création.",
      });
    });
};

exports.findAlls = (req, res) => {
  Structure.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération.",
      });
    });
};

exports.deletes = async (req, res) => {
  const { id } = req.params;
  try {
    await Structure.findByIdAndDelete(id);
    res.status(200).send({ message: 'Structure supprimé avec succès' });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la suppression du Structure' });
  }
};

exports.updates = async (req, res) => {
  const { id } = req.params;
  const { nomStructure, address } = req.body;
  try {
    const updatedStr = await Structure.findByIdAndUpdate(id, { nomStructure, address }, { new: true });
    res.status(200).send(updatedStr);
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la mise à jour du Structure' });
  }
};


//-----------------------------------profile---------------------------------------------
exports.createf = function (req, res) {
  // Valider la requête
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Rechercher un Profile avec le même e-mail
  Profile.findOne({ email: req.body.email })
    .then((existingProfile) => {
      if (existingProfile) {
        // Un Profile avec le même e-mail existe déjà
        res.status(401).send({ message: "Profile exists with this email." });
        return;
      }

      // Créer un nouveau Profile
      const profile = new Profile({
        email: req.body.email,
        mdp: req.body.mdp,
        fonction: req.body.fonction,
        structure: req.body.structure,

      });

      // Enregistrer le Profile dans la base de données
      profile
        .save()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Une erreur s'est produite lors de la création.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la recherche.",
      });
    });
};

exports.findAllf = (req, res) => {
  Profile.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération.",
      });
    });
};

exports.deletep = async (req, res) => {
  const { id } = req.params;
  try {
    await Profile.findByIdAndDelete(id);
    res.status(200).send({ message: 'Profile supprimé avec succès' });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la suppression du Profile' });
  }
};

exports.updatep = async (req, res) => {
  const { id } = req.params;
  const { email,mdp,fonction } = req.body;
  try {
    const updatedP = await Profile.findByIdAndUpdate(id, { email,mdp,fonction }, { new: true });
    res.status(200).send(updatedP);
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la mise à jour du Profile' });
  }
};

//---------------------------------demande----------------------------------------------
 

// Créer une nouvelle demande
exports.createDemande = function (req, res) {
  // Valider la requête
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Créer une nouvelle demande
  const demande = new Demande({
    nomDemandeur: req.body.nomDemandeur,
    prenomsDemandeur: req.body.prenomsDemandeur,
    typeDocument: req.body.typeDocument,
    dateDemande: req.body.dateDemande,
    etatDemande: req.body.etatDemande,
    numeroIdentification: req.body.numeroIdentification,
    cni: req.body.cni,
    dateDelivrance: req.body.dateDelivrance,
    lieuDelivrance: req.body.lieuDelivrance
  });

  // Enregistrer la demande dans la base de données
  demande
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la création de la demande.",
      });
    });
};

// Récupérer toutes les demandes
exports.findAllDemandes = (req, res) => {
  Demande.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération des demandes.",
      });
    });
};

// Supprimer une demande par ID
exports.deleteDemande = async (req, res) => {
  const { id } = req.params;
  try {
    await Demande.findByIdAndDelete(id);
    res.status(200).send({ message: 'Demande supprimée avec succès' });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la suppression de la demande' });
  }
};

// Mettre à jour une demande par ID
exports.updateDemande = async (req, res) => {
  const { id } = req.params;
  const { nomDemandeur, prenomsDemandeur, typeDocument, dateDemande, etatDemande, numeroIdentification, cni, dateDelivrance, lieuDelivrance } = req.body;
  try {
    const updatedDemande = await Demande.findByIdAndUpdate(
      id, 
      { nomDemandeur, prenomsDemandeur, typeDocument, dateDemande, etatDemande, numeroIdentification, cni, dateDelivrance, lieuDelivrance }, 
      { new: true }
    );
    res.status(200).send(updatedDemande);
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la mise à jour de la demande' });
  }
};
