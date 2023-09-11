const express = require("express");
const router = express.Router();
const controller = require("../controller/controllers");


// GET REQUESTS
router.get("/fetchAnnouncements", controller.fetchAnnouncements);
router.get("/edit", controller.editAnnouncement);
router.get("/delete", controller.deleteAnnouncement);
router.get("/test", (req,res) => {
    res.status(200).json({message : "Success"});
})
// POST REQUESTS
router.post("/signup", controller.signUp);
router.post("/login", controller.login);
router.post("/addAnnouncements", controller.addAnnouncements);

module.exports = router;
