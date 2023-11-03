const jwt = require("jsonwebtoken");
const pool = require("../pool");
const Mails = require('../emails/service')
const config = require("../config");
const readXlsxFile = require('read-excel-file/node');
const path = require('path');
var savedOTPS = {

};

const sendOTP = async (req,res) => {
  const { mail } = req.query;
  console.log(mail)
  let randomdigit = Math.floor(100000 + Math.random() * 900000);
    try {
      await Mails.sendOtpEmail(mail, randomdigit);
      res.status(200).send({ message: "OTP Sent" });
        savedOTPS[mail] = randomdigit;
        setTimeout(() => {
            delete savedOTPS[`${mail}`];
        }, 10000);
        console.log(savedOTPS); 
    } catch(e) {
        console.log(e);
        res.status(400).send({ error: "Unable to send OTP" });
    }
     
     /* let expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + 1); // OTP expires after 15 minutes
      let [rows] = await pool.query('INSERT INTO otps VALUES (?, ?, ?)', [otpemail, randomdigit, expiry]);  */
}

const login = async (req, res) => {
  console.log(req.body)
  const { userName, password } = req.body;
  try {
    if (!userName || !password) {
      res.json({ message: "Enter all data", status: false });
    } else {
      const sqlQuery = "SELECT * FROM user WHERE BINARY username = ?";
      const [logins] = await pool.execute(sqlQuery, [userName]);

      if (logins.length === 0) {
        res.json({ msg: "User does not exist" });
      } else {
        const userData = logins[0];
        console.log(userData)
        if (userData.password === password) {
          const token = jwt.sign({ id: userData.username }, config.JWT_TOKEN_KEY);
          res.json({
            message: "Login successful",
            token: token,
            username: userData.username,
            status: true,
          });
        } else {
          res.status(false).json({ error: "Invalid username/password"});
        }
      }
    }
  } catch (err) {
    res.status(500).json({ errorMessage: "Internal server error, please try again later."});
  }
  
};


const signUp = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    console.log(firstName, lastName, userName, email, password)
    if (!firstName || !lastName || !userName || !email || !password) {
      res.json({ message: "enter all data", status: false });
    } else {
      const insertQuery =
        "INSERT INTO user (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)";
      let signup = await pool.query(insertQuery, [
        firstName,
        lastName,
        userName,
        email,
        password,
      ]);
      console.log(signup)
      res.status(201).json({ message: "User signed up successfully", status: true });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ errorMessage: "An error occurred while signing up", status: false });
  }
};

const addAnnouncements = async (req,res) => {

  try{

    const { title, message, userName, date } = req.body;
    console.log(title, message, userName, date);
    if (!title || !message || !userName || !date) {
      res.json({ errorMessage: "enter all data", status: false });
    } else {
      const insertQuery =
        "INSERT INTO announcements (title, message, username, date) VALUES (?, ?, ?, ?)";
      let add = await pool.query(insertQuery, [
        title, message, userName, date
      ]);
      console.log(add)
      res.status(201).json({ message: "Announcements added successfully" });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "An error occurred while signing up"});
  }

}

const fetchAnnouncements = async (req,res) => {
  try{
    const fetchQuery = "SELECT * FROM announcements";
    const [announcements] = await pool.execute(fetchQuery);
    if (announcements.length == 0) {
      res.status(401).json({ errorMessage: "Empty announcements" });
    } else {
     // console.log(announcements)
      res.status(201).json({announcements : announcements});
    }

  } catch (err) {
    res.status(500).json({ errorMessage: err});
  }

}

const editAnnouncement = async (req,res) => {
  try{
    const { id } = req.query;
    console.log(id);
    const fetchQuery = `SELECT * FROM announcements WHERE ID = ${id}`;
    const [announcements] = await pool.execute(fetchQuery);
    if (announcements.length == 0) {
      res.status(401).json({ errorMessage: "Empty announcements" });
    } else {
        res.status(201).json({idAnnouncement : announcements[0]});     
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
}

const deleteAnnouncement = async (req,res) => {
  try{
    const { id } = req.query;
    console.log(id);
    const fetchQuery = "DELETE FROM announcements WHERE ID = ? ";
    const announcements = await pool.execute(fetchQuery, [id]);
    console.log(announcements);
    res.status(201).json({message: "Deleted Successfully"});

  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
}

const saveAnnouncement = async (req,res) =>{

  const { title,message,username,date, previousTitle,ID} = req.body;
  try{
    if(ID){

    const query = `UPDATE announcements SET title = \'${title}\', message = \'${message}\', date = \'${date}\' WHERE ID = \'${ID}\';`
    const result = await pool.execute(query);
    console.log(result);
    res.status(201).json({message : "Edited Successfully"});
  } else {
    res.status(201).json({message : "No previous title"});
  }
  } catch(err){
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
  
}

const addData = async (req,res) => {
  const { classname,riderid,ridername,school,horsename,provider } = req.body;
  try{
    if(classname && riderid && ridername && school && horsename && provider){

    const query = `INSERT INTO data (classname,riderid,ridername,school,horsename,provider) VALUES (?,?,?,?,?,?);`;
    const result = await pool.execute(query, [classname,riderid,ridername,school,horsename,provider]);
    console.log(result);
    res.status(201).json({message : "Added Successfully"});
  } else {
    res.status(201).json({error : "Error Adding Data to database"});
  }
  } catch(err){
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
}

const getData = async (req,res) => {
  try{

    const Rquery = `SELECT r.*, f.filename
    FROM (
        SELECT MAX(f.file_id) AS latest_rider_id
        FROM files AS f
        WHERE f.filename LIKE '%-riders%'
    ) AS latest_rider
    LEFT JOIN riders AS r ON r.file_id = latest_rider.latest_rider_id
    LEFT JOIN files AS f ON r.file_id = f.file_id;
    `;

    const Hquery = `
    SELECT h.*, f.filename
    FROM (
        SELECT MAX(f.file_id) AS latest_horse_id
        FROM files AS f
        WHERE f.filename LIKE '%-horses%'
    ) AS latest_horse
    LEFT JOIN horses AS h ON h.file_id = latest_horse.latest_horse_id
    LEFT JOIN files AS f ON h.file_id = f.file_id;
    
    `;
    const Rlist = await pool.execute(Rquery);
    const Hlist = await pool.execute(Hquery);
    if(Rlist[0].length === 0 || Hlist[0].length === 0 ){
      res.status(404).json({errorMessage : "No Data to show"});
    } else {
      res.status(201).json({success: "Successfully fetched",Rlist:Rlist[0],Hlist:Hlist[0]});
    }
  }  catch(err){
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
}

const saveCombination = async (req,res) => {
  try{
    const { classname, horses,riders } = req.body;
    const query = `INSERT INTO randomizer(classname,riderName,horsename) VALUES(?,?,?);`;
    const leng = horses.length
    for(let i=0; i< leng;i++){
      let list = await pool.execute(query,[classname,riders[i],horses[i]]);
    }
    res.status(200).json({success: "Uploaded Successfully"});
  } catch (err){
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
}

const uploadRider = async (req,res) => {
 // console.log(req,res);
try{
  const filePath = path.join(__dirname, '..', '..', 'files', req.file.filename);
  const rows = await readXlsxFile(filePath).then((data) => {
      data.shift();
      if (data) {
        return data;
      }
    })
  console.log("No.of rider rows = ",rows.length);
 // res.status(200).json({success: rows.length});
   if(rows.length > 0 ){
   const fileQuery = `INSERT INTO files (filename) VALUES(?);`;
    const [result] = await pool.query(fileQuery,[req.file.filename]);
    console.log(result.insertId);
    if(result.affectedRows == 1){

         const query = `INSERT INTO riders (file_id, riderid, name, height, weight, experience, school,placing, class, remarks,oh_ow) VALUES (?,?,?,?,?,?,?,?,?,?,?);`
         for(let i=0; i<rows.length;i++){
      
         await pool.query(query,[result.insertId,rows[i][0],rows[i][1],rows[i][2],rows[i][3],rows[i][4],rows[i][5],rows[i][6],rows[i][7],rows[i][8],rows[i][9]]);
     
        };

    } 
    res.status(200).json({success: "Uploaded Successfully"});
   }
  // res.status(200).json({success: "Uploaded"});
  
} catch (err){
  console.log(err);
  res.status(500).json({ errorMessage: err });
}
}

const uploadHorse = async (req,res) => {
  // console.log(req,res);
 try{
  const filePath = path.join(__dirname, '..', '..', 'files', req.file.filename);
  const rows = await readXlsxFile(filePath).then((data) => {
     data.shift();
     if (data) {
       return data;
     }
   })
     console.log("No.of horse rows = ",rows.length);
    if(rows.length > 0 ){
     const fileQuery = `INSERT INTO files (filename) VALUES(?);`;
     const [result] = await pool.query(fileQuery,[req.file.filename]);
     console.log(result.insertId);
     if(result.affectedRows == 1){
 
          const query = `INSERT INTO horses (file_id, draw_order, name, provider, spur, rein_hold, remarks,class,isStrong) VALUES (?,?,?,?,?,?,?,?,?);`
          for(let i=0; i<rows.length;i++){
       
          await pool.query(query,[result.insertId,rows[i][0],rows[i][1],rows[i][2],rows[i][3],rows[i][4],rows[i][5],rows[i][6],rows[i][7]]);
      
         };
 
     } 
     res.status(200).json({success: "Uploaded Successfully"});
    }
   // res.status(200).json({success: "Uploaded"});
   
 } catch (err){
   console.log(err);
   res.status(500).json({ errorMessage: err });
 }
 }

 const addRider = async (req,res) =>{

  try{
    const { riderclass,experience,height,oh_ow,placing,remarks,riderid,ridername,school,weight,file_id } = req.body;
    const query = `INSERT INTO riders(file_id,class,riderid,name,school,height,weight,experience,remarks,placing,oh_ow) VALUES(?,?,?,?,?,?,?,?,?,?,?);`;
    const insert = await pool.execute(query,[file_id,riderclass,riderid,ridername,school,height,weight,experience,remarks,placing,oh_ow]);
    res.status(200).json({success: "Added Successfully"});
  } catch (err){
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
  
}

const addHorse = async (req,res) =>{

  try{
    const { horseclass,remarks,spur,rein_hold,name,provider,file_id,isStrong } = req.body;
    const remarksValue = remarks !== undefined ? remarks : null;
    const spurValue = spur !== undefined ? spur : null;
    const rein_holdValue = rein_hold !== undefined ? rein_hold : null;
    const query = `INSERT INTO horses(class,remarks,spur,rein_hold,name,provider,file_id,isStrong) VALUES(?,?,?,?,?,?,?,?);`;
    for(let i=0; i< horseclass.length; i++){
      //console.log(horseclass[i]);
      const insert = await pool.execute(query,[horseclass[i],remarksValue,spurValue,rein_holdValue,name,provider,file_id,isStrong]);
    }
    res.status(200).json({success: "Added Successfully"});
  } catch (err){
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
  
}

const editRider = async (req,res) =>{

  const {riderid,name,school,height,classname, weight,experience,remarks,placing,oh_ow,primary_key} = req.body;
  try{
    if(primary_key){

    const query = `UPDATE riders SET riderid = ${riderid}, class=\'${classname}\', name = \'${name}\',school = \'${school}\', height = \'${height}\',weight = \'${weight}\', experience = \'${experience}\', remarks = \'${remarks}\',placing = \'${placing}\', oh_ow = \'${oh_ow}\'  WHERE ID = ${primary_key};`
    const result = await pool.execute(query);
    console.log(result);
    res.status(201).json({message : "Edited Successfully"});
  } else {
    res.status(201).json({message : "No primary key"});
  }
  } catch(err){
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
  
}

const editHorse = async (req,res) =>{

  const {  classname,remarks,spur,rein_hold,name,provider,primary_key,isStrong} = req.body;
  try{
    if(primary_key){

      const query = `UPDATE horses SET class = \'${classname}\', remarks=\'${remarks}\', spur = \'${spur}\',rein_hold = \'${rein_hold}\', name = \'${name}\',provider = \'${provider}\', isStrong = ${isStrong}  WHERE ID = ${primary_key};`
      const result = await pool.execute(query);
    console.log(result);
    res.status(201).json({message : "Edited Successfully"});
  } else {
    res.status(201).json({message : "No primary key"});
  }
  } catch(err){
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
  
}

const deleteRider = async (req,res) =>{

  const { ID } = req.body;
  try{
    if(ID){

      const deleteQuery = "DELETE FROM riders WHERE ID = ? ";
      const result = await pool.execute(deleteQuery, [ID]);
    console.log(result);
    res.status(201).json({message : "Deleted Successfully"});
  } else {
    res.status(201).json({message : "Failed to delete"});
  }
  } catch(err){
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
  
}

const deleteHorse = async (req,res) =>{

  const { ID } = req.body;
  try{
    if(ID){

      const deleteQuery = "DELETE FROM horses WHERE ID = ? ";
      const result = await pool.execute(deleteQuery, [ID]);
    console.log(result);
    res.status(201).json({message : "Deleted Successfully"});
  } else {
    res.status(201).json({message : "Failed to delete"});
  }
  } catch(err){
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
  
}

module.exports = {
  login,
  signUp,
  addAnnouncements,
  fetchAnnouncements,
  editAnnouncement,
  deleteAnnouncement,
  saveAnnouncement,
  addData,
  getData,
  saveCombination,
  uploadRider,
  uploadHorse,
  addRider,
  addHorse,
  editRider,
  editHorse,
  deleteRider,
  deleteHorse,
  sendOTP
};
