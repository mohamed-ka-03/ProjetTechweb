
const mongoose = require('mongoose');
const db = require("../models");
const Extrait = require('../models/extrait.model');   
const Demande = require('../models/demande.model');  
const PDFDocument = require('pdfkit');
const fs = require('fs'); 
const path = require('path');
const pdf = require('html-pdf');
const ObjectId = mongoose.Types.ObjectId;
const puppeteer = require('puppeteer');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
  
//  const TemplateExtrait = require('../../frontend/app/citoyen/extrait/[[...extrait]]/TemplateExtrait.html')  
//  //templte
//  exports.renderTemplateExtrait = (req, res) => {
//   const component = ReactDOMServer.renderToString(React.createElement(TemplateExtrait));
//   const html = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Extrait de Naissance</title>
//       <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
//     </head>
//     <body>
//       <div id="root">${component}</div>
//     </body>
//     </html>
//   `;
//   res.send(html);
// };
//  //-------------------------//

exports.createExtrait = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Le contenu ne peut pas être vide !" });
  }

  try {
    const {
      nom,
      prenoms,
      dateNaissance,
      lieuNaissance,
      nomPere,
      prenomsPere,
      nomMere,
      prenomsMere,
      sexe,
      numeroIdentification,
      cni,
      dateDelivrance,
      lieuDelivrance,
      signatureOfficierEtatCivil,
      emailDemandeur,
      telephoneDemandeur,
      adresseDemandeur,
      typeDocument
    } = req.body;

    // Vérifier si le numeroIdentification ou cni existe déjà
    const existingExtrait = await Extrait.findOne({
      $or: [{ numeroIdentification }, { cni }]
    });

    if (existingExtrait) {
      return res.status(400).send({ message: "Le numéro d'identification ou le CNI existe déjà !" });
    }

    // Créer un nouveau document Extrait
    const newExtrait = new Extrait({
      nom,
      prenoms,
      dateNaissance,
      lieuNaissance,
      nomPere,
      prenomsPere,
      nomMere,
      prenomsMere,
      sexe,
      numeroIdentification,
      cni,
      dateDelivrance,
      lieuDelivrance,
      signatureOfficierEtatCivil
    });

    // Enregistrer le nouvel extrait
    const extraitData = await newExtrait.save();

    // Créer une nouvelle demande associée à l'extrait
    const newDemande = new Demande({
      nomDemandeur: nom,
      prenomsDemandeur: prenoms,
      emailDemandeur,
      telephoneDemandeur,
      adresseDemandeur,
      typeDocument,
      numeroIdentification:numeroIdentification,
    });

    // Enregistrer la nouvelle demande
    const demandeData = await newDemande.save();

    // Envoyer les données des deux documents en réponse
    res.send({ extrait: extraitData, demande: demandeData });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur s'est produite lors de la création de l'extrait de naissance et de la demande."
    });
  }
};

  // Récupérer tous les extraits de naissance
  exports.findAllExtraits = async (req, res) => {
    try {
      const Extraits = await Extrait.find();
      res.status(200).json(Extraits);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  
  exports.findAllExtraitdm = async (req, res) => {
    try {
      const Demandes = await Demande.find();
      res.status(200).json(Demandes);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  };

  exports.findAllExtraitdmc = async (req, res) => {
    const { email } = req.body;
     console.log(email);
    try {
      const Demandes = await Demande.find({ 
        emailDemandeur: email });
     
      // Envoyer les données en une seule réponse
      res.status(200).send(Demandes);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  exports.traiterDemandepdf = async (req, res) => {
    const { id } = req.params;
    const { signatureOfficierEtatCivil, numeroIdentification } = req.body;
  
    try {
      // Vérifier si la demande existe et si elle n'est pas déjà terminée
      const demandeExistante = await Demande.findById(id);
      const extraitExistante = await Extrait.find({numeroIdentification:numeroIdentification});

      if (!demandeExistante) {
        return res.status(404).json({ message: 'Demande non trouvée' });
      } 
      if (demandeExistante.etatDemande === 'terminé') {
        return res.status(400).json({ message: 'Demande déjà traitée' });
      }
  
      // Mettre à jour la demande avec la signature et changer l'état à 'terminé'
      const demande = await Demande.findByIdAndUpdate(id, {
        signatureOfficierEtatCivil: signatureOfficierEtatCivil,
        etatDemande: 'terminé',
      }, { new: true });
  
      // Vérifier si l'extrait existe et le mettre à jour
      const extrait = await Extrait.findOneAndUpdate(
        { numeroIdentification: numeroIdentification },
        { signatureOfficierEtatCivil: signatureOfficierEtatCivil },
        { new: true }
      );
  
      if (!extrait) {
        return res.status(404).json({ message: 'Extrait non trouvé' });
      }
  
      // Lire le fichier HTML et remplacer les placeholders
      const templatePath = path.resolve(__dirname, '../../frontend/app/citoyen/extrait/[[...extrait]]/TemplateExtrait.html');
      console.log(`Template path: ${templatePath}`); // Debug
      if (!fs.existsSync(templatePath)) {
        throw new Error('Template HTML file not found');
      }
       
      console.log(extraitExistante)
      let html = fs.readFileSync(templatePath, 'utf8');
      html = html.replace('{{nomDemandeur}}', demande.nomDemandeur)
                 .replace('{{prenomsDemandeur}}', demande.prenomsDemandeur)
                 .replace('{{dateNaissance}}', extrait.dateNaissance)
                 .replace('{{lieuNaissance}}', extrait.lieuNaissance)
                 .replace('{{nomPere}}', extrait.nomPere)
                 .replace('{{prenomsPere}}', extrait.prenomsPere)
                 .replace('{{nomMere}}', extrait.nomMere)
                 .replace('{{prenomsMere}}', extrait.prenomsMere)
                 .replace('{{sexe}}', extrait.sexe)
                 .replace('{{numeroIdentification}}', demande.numeroIdentification)
                 .replace('{{cni}}', extrait.cni)
                 .replace('{{dateDelivrance}}', extrait.dateDelivrance)
                 .replace('{{lieuDelivrance}}', extrait.lieuDelivrance)
                 .replace('{{signatureOfficierEtatCivil}}', extrait.signatureOfficierEtatCivil);
  
      // Options pour html-pdf
      const options = {
        format: 'A4',
        orientation: 'portrait',
        border: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      };
  
      // Générer le PDF à partir du HTML
      const pdfPath = path.resolve(__dirname, `../pdfs/demande-${id}.pdf`);
      console.log(`PDF path: ${pdfPath}`); // Debug
  
      pdf.create(html, options).toFile(pdfPath, (err, response) => {
        if (err) {
          console.error('Erreur lors de la génération du PDF:', err);
          return res.status(500).json({ message: 'Erreur lors de la génération du PDF' });
        }
  
        // Enregistrer le chemin du PDF dans la base de données
        demande.pdfPath = pdfPath;
        demande.save();
  
        res.json(demande);
      });
  
    } catch (error) {
      console.error('Erreur lors du traitement de la demande:', error);
      res.status(500).json({ message: error.message });
    }
  };
  //recuperer pdf 

  exports.getpdf = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Rechercher la demande dans la base de données
      const demande = await Demande.findById(id);
      if (!demande || demande.etatDemande !== 'terminé') {
        return res.status(404).json({ message: 'Vous ne pouvez pas télécharger ce PDF car la demande n\'est pas terminée' });
      }
  
      const pdfPath = demande.pdfPath; // Récupérez le chemin enregistré dans la demande
      
      // Vérifier si le fichier PDF existe
      fs.access(pdfPath, fs.constants.F_OK, (err) => {
        if (err) { 
          return res.status(404).json({ message: 'PDF non trouvé' });
        }
  
        // Envoyer le fichier PDF en réponse
        res.sendFile(path.resolve(pdfPath));
      });
    } catch (error) { 
      console.error('Erreur lors du téléchargement du PDF:', error);
      res.status(500).json({ message: error.message });
    }
  };

  //rejetter demande  

  exports.rejectDemande = async (req, res) => {
    const { id } = req.params;
  
    try {
      const demande = await Demande.findById(id);
      if (!demande) {
        return res.status(404).json({ message: 'Demande non trouvée' });
      }
  
      demande.etatDemande = 'rejetée';
      await demande.save();
  
      res.json({ message: 'Demande rejetée avec succès' });
    } catch (error) {
      console.error('Erreur lors du rejet de la demande:', error);
      res.status(500).json({ message: error.message });
    }
  };