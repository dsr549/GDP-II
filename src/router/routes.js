const express = require("express");
const router = express.Router();
const controller = require("../controller/controllers");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,__dirname + '/files/')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    },
  });

const uploadFile = multer({ storage: storage });

// GET REQUESTS
router.get("/fetchAnnouncements", controller.fetchAnnouncements);
router.get("/edit", controller.editAnnouncement);
router.get("/delete", controller.deleteAnnouncement);
router.get("/getData", controller.getData);
router.get("/test", (req,res) => {
    res.status(200).json({message : "Success"});
})
// POST REQUESTS
router.post("/signup", controller.signUp);
router.post("/login", controller.login);
router.post("/addAnnouncements", controller.addAnnouncements);
router.post("/saveAnnouncement",controller.saveAnnouncement);
router.post("/adddata", controller.addData);
router.post("/saveRandomizer", controller.saveCombination);
router.post("/uploadRider", uploadFile.single('riders'), controller.uploadRider);
router.post("/uploadHorse", uploadFile.single('horses'), controller.uploadHorse);
module.exports = router;
