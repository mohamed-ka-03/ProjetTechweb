const mongoose = require('mongoose');
const db = require("../models");
const Compte = require('../models/compte.model');


exports.createCompte = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Le contenu ne peut pas être vide !" });
    }

    const { nom, prenom, cni, email, mdp, pathPhoto } = req.body;

    try {
        // Check if an account with the same cni already exists
        const existingCompte = await Compte.findOne({ cni: cni });
        if (existingCompte) {
            return res.status(400).send({ message: "Un compte avec ce CNI existe déjà." });
        }
        const existingComptee = await Compte.findOne({ email: email });
        if (existingComptee) {
            return res.status(400).send({ message: "Un compte avec ce email existe déjà." });
        }


        // If no existing account, create a new one
        const compteC = new Compte({ nom, prenom, cni, email, mdp, pathPhoto });
        const compteCc = await compteC.save();
        res.send({ compteCc: compteCc });

    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la création du compte" });
    }
};
exports.verifCompte = async (req, res) => {
    if (req.body) {
        try {
            const { email, mdp } = req.body;
console.log(email)
            // Assuming Compte.find() returns a Promise
            const userAccount = await Compte.findOne({ email: email, mdp: mdp });

            if (userAccount) {
                return res.status(200).send({ message: "Connexion réussie" });
            } else {
                return res.status(401).send({ message: "Email ou mot de passe incorrect" });
            }
        } catch (error) {
            console.error('Erreur serveur', error);
            return res.status(500).json({ message: error.message });
        }
    } else {
        // Handle case where req.body is empty or undefined
        return res.status(400).send({ message: "Requête invalide, données manquantes." });
    }
};