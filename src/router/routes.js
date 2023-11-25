const express = require("express");
const router = express.Router();
const controller = require("../controller/controllers");
const multer = require('multer');
const path = require('path');
const time = new Date();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const env = require('../config')

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_SECRET
  });
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
  folder: "IHSA",
  allowedFormats: ["jpg", "png"],
  }
});

const parser = multer({ storage: cloudStorage });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', '..', 'files'));
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + time.getHours()+ '-' + time.getMinutes() + '-' + file.originalname)
    },
  });

const uploadFile = multer({ storage: storage });

// GET REQUESTS
router.get("/fetchAnnouncements", controller.fetchAnnouncements);
router.get("/edit", controller.editAnnouncement);
router.get("/delete", controller.deleteAnnouncement);
router.get("/getData", controller.getData);
router.get("/sendOTP", controller.sendOTP);
router.get("/checkOTP", controller.checkOTP);
router.get("/getRandomizedData", controller.getRandomizer);
router.get("/getAdmins", controller.getAdmins);
router.get("/getFolders", controller.getFolders)

router.get("/test", (req,res) => {
    res.status(200).json({message : "Success"});
})

// POST REQUESTS
router.post("/signup", controller.signUp);
router.post("/login", controller.login);
router.post("/showAdminLogin", controller.showAdminLogin);
router.post("/addAnnouncements", controller.addAnnouncements);
router.post("/saveAnnouncement",controller.saveAnnouncement);
router.post("/adddata", controller.addData);
router.post("/saveRandomizer", controller.saveCombination);
router.post("/uploadRider", uploadFile.single('riders'), controller.uploadRider);
router.post("/uploadHorse", uploadFile.single('horses'), controller.uploadHorse);
router.post("/addRider", controller.addRider);
router.post("/addHorse", controller.addHorse);
router.post("/editRider", controller.editRider);
router.post("/editHorse", controller.editHorse);
router.post("/deleteRider", controller.deleteRider);
router.post("/deleteHorse", controller.deleteHorse);
router.post("/changePassword", controller.changePassword);
router.post("/addShowAdmin", controller.addShowAdmin);
router.post("/editShowAdmin", controller.editShowAdmin);
router.post("/addFolder", controller.addFolder);
router.post("/addImage",parser.single("imageInput"), controller.addImage);

// DELETE REQUESTS
router.delete("/deleteShowAdmin", controller.deleteShowAdmin);
router.delete("/deleteFolder", controller.deleteFolder);
module.exports = router;
