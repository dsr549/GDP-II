;const express = require("express");
const cors = require("cors");
const router = require("./src/router/routes.js");
const vhost = require('vhost');
const path = require('path');
const config = require('./src/config.js')
const publicDirectoryPath=path.join(__dirname,'public');


const port = 3000;

const app = express();
const adminApp = express();


// Set up middleware for admin subdomain
const adminDirectoryPath = path.join(__dirname, 'admin');
adminApp.use(express.static(adminDirectoryPath));
app.use(vhost(`admin.${config.IP}`, adminApp));
//adminApp.use("/admin/api", router);

// cors
app.use(cors());
app.use(express.static(publicDirectoryPath))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/admin/api", router);
app.get("/", (req, res) => res.send("success"));

// Set up Aadmin other middleware
adminApp.use(express.json());
adminApp.use(cors());
//adminApp.use(helmet());
//adminApp.use('/admin/api', adminRouter);
adminApp.use(express.urlencoded({ extended: true }));

adminApp.get("/",(req,res) => {
  res.status(200).json({Response: "Helmoo from admin!"});
});

app.listen(port, () => {
  console.log(`local server started on http://localhost:${port}`);
});
