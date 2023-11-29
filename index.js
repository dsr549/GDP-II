const express = require("express");
const cors = require("cors");
const router = require("./src/router/routes.js");
const vhost = require('vhost');
const path = require('path');
const config = require('./src/config.js')

const port = 3000;




const app = express();

// Serve files from the current directory
app.use(express.static(__dirname));

// Set up middleware for /admin path
const adminDirectoryPath = path.join(__dirname, 'admin');
app.use('/admin', express.static(adminDirectoryPath));

const publicDirectoryPath = path.join(__dirname, 'public');

// cors
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", router);


// Add a middleware for /admin path redirection


app.use(express.static(publicDirectoryPath));

app.get("/", (req, res) => res.send("success"));

app.get("/api/test", (req, res) => {
  res.status(200).json({ Response: "Hello from admin!" });
});

app.listen(port, () => {
  console.log(`Local server started on http://localhost:${port}`);
});



/*
const port = 3000;

const app = express();
const adminApp = express();

// Serve files from the current directory
app.use(express.static(__dirname));

// Set up middleware for admin subdomain
const adminDirectoryPath = path.join(__dirname, 'admin');
adminApp.use(express.static(adminDirectoryPath));
app.use(vhost(`admin.${config.IP}`, adminApp));

const publicDirectoryPath=path.join(__dirname,'public');

// cors
app.use(cors());
app.use("/api", router);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(publicDirectoryPath))

app.get("/", (req, res) => res.send("success"));

// Set up Admin other middleware
adminApp.use(express.json());
adminApp.use(cors());
adminApp.use(express.urlencoded({ extended: true }));

// adminApp.get(/^\/(?!admin\/api). *(.)/, (req, res) => {
  res.redirect('/');
});

adminApp.get("/",(req,res) => {
  res.status(200).json({Response: "Hello from admin!"});
});

app.listen(port, () => {
  console.log(`local server started on http://localhost:${port}`);
});


*/
