 
const admin  = require("../controllers/Admin.controller");
const extrait = require("../controllers/Extrait.controller"); 
const log = require("../controllers/log.controller"); 


let router = require("express").Router();
 
//document
router.post("/create/doc", admin.created);
router.get("/get/doc", admin.findAlld);
router.delete("/delete/doc/:id", admin.deleted);
router.put("/update/doc/:id", admin.updated);
router.post("/update/docc/:id", admin.formEnregistrement);
router.get("/get/docc", admin.formread);




//structure
router.post("/create/structure", admin.creates);
router.get("/get/structure", admin.findAlls);
router.delete("/delete/structure/:id", admin.deletes);
router.put("/update/structure/:id", admin.updates);
 
//profile
router.post("/create/profile", admin.createf);
router.get("/get/profile", admin.findAllf);
router.delete("/delete/profile/:id", admin.deletep);
router.put("/update/profile/:id", admin.updatep);

//demande
router.post("/create/demande", admin.createDemande);
router.get("/get/demande", admin.findAllDemandes);
router.delete("/delete/demande/:id", admin.deleteDemande);
router.put("/update/demande/:id", admin.updateDemande);

//extrait
router.post("/create/dm/extrait",extrait.createExtrait);
router.get("/get/dm/extrait", extrait.findAllExtraitdm);
router.post("/get/dm/extraitc", extrait.findAllExtraitdmc);

router.put("/traiter/dm/:id",extrait.traiterDemandepdf);
router.get("/dm/:id/pdf",extrait.getpdf);
router.delete('/reject/dm/:id', extrait.rejectDemande);

//log
router.post("/create/compte",log.createCompte);
router.post("/verif/compte",log.verifCompte);

module.exports = router;