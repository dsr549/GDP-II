const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const pool = require("../pool");
const Mails = require('../emails/service')
const config = require("../config");
const readXlsxFile = require('read-excel-file/node');
const path = require('path');
var savedOTPS = {

};

const getAdmins = async (req,res) => {
  try {
    const sqlQuery = "SELECT * FROM admins";
      const [logins] = await pool.execute(sqlQuery);
      res.status(200).send({ list : logins })
  } catch (err) {
    console.log(err);
    res.status(500).send({ errorMessage : "Failed to get admin data"})
  }
}

const addShowAdmin = async (req,res) => {
  try{
    const { username, email } = req.body;
    let password = username+"123";
    let isShowAdmin = 1;
    if (!username || !email || !password) {
      res.status(false).json({ message: "Enter all data", status: false });
    } else {
      const hashedPassword = await bcrypt.hash( password, 10);
     // console.log(hashedPassword)
      const insertQuery =
        "INSERT INTO admins (username, email, password_hash, isShowAdmin) VALUES (?, ?, ?,?)";
      const [result] = await pool.execute(insertQuery, [ username, email, hashedPassword, isShowAdmin]);
     // console.log("result -> ",result)
      if (result.affectedRows > 0) {
        res.status(201).json({ message: "Show admin added successfully" });
      } else {
        res.status(400).json({ errorMessage: "Failed to add show admin" });
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ errorMessage : "Failed to add show admin"})
  }
}

const editShowAdmin = async (req,res) => {
  try{
    const { username, email, id } = req.body;
    console.log(id);
    const fetchQuery = `UPDATE admins SET username = \'${username}\', email = \'${email}\' WHERE user_id = \'${id}\';`; 
    const [updateAdmin] = await pool.execute(fetchQuery);
    console.log(updateAdmin)
    if (updateAdmin.affectedRows > 0) {
      res.status(200).send({success: "show admin data edited successfully"});
    } else {
      console.log("Unable to edit show admin");
      res.status(400).send({errorMessage : "Failed to edit show admin data"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
}

const deleteShowAdmin = async (req,res) => {
  try{
    const { id } = req.query;
    console.log(id);
    const fetchQuery = "DELETE FROM admins WHERE user_id = ? ";
    const [deleteAdmin] = await pool.execute(fetchQuery, [id]);
    console.log(deleteAdmin)
    if (deleteAdmin.affectedRows > 0) {
      res.status(200).send({success: "show admin data deleted successfully"});
    } else {
      console.log("Unable to delete show admin");
      res.status(400).send({errorMessage : "Failed to delete show admin data"});
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
}

const sendOTP = async (req,res) => {
  const { mail, isShowAdmin } = req.query;
  console.log(mail)
  let randomdigit = Math.floor(100000 + Math.random() * 900000);
    try {
      console.log(isShowAdmin , isShowAdmin === "true")
      let sqlQuery = isShowAdmin === "true" ? "SELECT * FROM admins WHERE BINARY email = ? AND isShowAdmin = 1;" : "SELECT * FROM admins WHERE BINARY email = ? AND isShowAdmin = 0;";
      console.log(sqlQuery)
      const [logins] = await pool.execute(sqlQuery, [mail]);
      console.log(logins)
      if (logins.length === 0) {
        res.status(404).json({ error: "Email is not registered" });
      } else {
        await Mails.sendOtpEmail(mail, randomdigit);
      res.status(200).send({ message: "OTP Sent" });
        savedOTPS[mail] = randomdigit;
        setTimeout(() => {
            delete savedOTPS[`${mail}`];
        }, 180000);
        console.log(savedOTPS); 
      }
      
    } catch(e) {
        console.log(e);
        res.status(400).send({ error: "Unable to send OTP" });
    }
     
     /* let expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + 1); // OTP expires after 15 minutes
      let [rows] = await pool.query('INSERT INTO otps VALUES (?, ?, ?)', [otpemail, randomdigit, expiry]);  */
}

const checkOTP = async (req,res ) => {
  console.log(req.query);
  const { mail, OTP } = req.query;
  try{
    if (savedOTPS[mail] && savedOTPS[mail].toString() === OTP.toString()) {
      res.status(200).send({message : "OTP matched!"})
      delete savedOTPS[mail];
    } else {
      res.status(400).send({error: "Wrong otp!"})
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({error: "Wrong otp!"})
  }
}

const changePassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password

      const sqlQuery = `UPDATE admins SET password_hash = ? WHERE email = ?`;
      const [result] = await pool.execute(sqlQuery, [hashedPassword, email]);
      if(result.affectedRows > 0){
        res.status(200).send({ message: "Password changed successfully" });
      } else {
        res.status(404).send({ error: "Email not found" });
      }
      
    } else {
      res.status(404).send({ error: "Email not found" });
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ error: "An error occurred while changing the password" });
  }
}

const login = async (req, res) => {
  const { userName, password } = req.body;
  try {
    if (!userName || !password) {
      res.json({ error: "Enter all data", status: false });
    } else {
      const sqlQuery = "SELECT * FROM admins WHERE BINARY username = ? AND isShowAdmin = 0";
      const [logins] = await pool.execute(sqlQuery, [userName]);
      console.log(logins , logins.length === 0 )
      if (logins.length === 0) {
        res.status(404).json({ msg: "User does not exist" });
      } else {
        const userData = logins[0];
        const passwordMatch = await bcrypt.compare(password, userData.password_hash); 
        if (passwordMatch) {
          const token = jwt.sign({ id: userData.username }, config.JWT_TOKEN_KEY);
          res.json({
            message: "Login successful",
            token: token,
            username: userData.username,
            status: true,
            isShowAdmin: userData.isShowAdmin
          });
        } else {
          res.status(401).json({ error: "Invalid username/password" });
        }
      }
    }
  } catch (err) {
    console.log(err)
    res.status(404).json({ error: "Invalid username/password" });
  }
}

const showAdminLogin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    if (!userName || !password) {
      res.json({ error: "Enter all data", status: false });
    } else {
      const sqlQuery = "SELECT * FROM admins WHERE BINARY username = ? AND isShowAdmin = 1";
      const [logins] = await pool.execute(sqlQuery, [userName]);
      console.log(" Logins --> ",logins)
      if (logins.length === 0) {
        res.status(404).json({ msg: "User does not exist" });
      } else {
        const userData = logins[0];
        const passwordMatch = await bcrypt.compare(password, userData.password_hash); 
        if (passwordMatch) {
          const token = jwt.sign({ id: userData.username }, config.JWT_TOKEN_KEY);
          res.json({
            message: "Login successful",
            token: token,
            username: userData.username,
            status: true,
            isShowAdmin: userData.isShowAdmin
          });
        } else {
          res.status(401).json({ error: "Invalid username/password" });
        }
      }
    }
  } catch (err) {
    console.log(err)
    res.status(404).json({ error: "Invalid username/password" });
  }
}

const signUp = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password, isShowAdmin } = req.body;
    
    if (!firstName || !lastName || !userName || !email || !password) {
      res.status(false).json({ message: "Enter all data", status: false });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
     // console.log(hashedPassword)
      const insertQuery =
        "INSERT INTO admins (firstname, lastname, username, email, password_hash, isShowAdmin) VALUES (?, ?, ?, ?, ?,?)";
      const [result] = await pool.execute(insertQuery, [firstName, lastName, userName, email, hashedPassword, isShowAdmin]);
     // console.log("result -> ",result)
      if (result.affectedRows > 0) {
        res.status(201).json({ message: "User signed up successfully" });
      } else {
        res.status(400).json({ errorMessage: "User signup failed"});
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ errorMessage: "An error occurred while signing up" });
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

const saveCombination = async (req, res) => {
  const tablesData = req.body.tables;
  const file_id = req.body.file_id;
  const conn = await pool.getConnection();

  try {
    let errorOccurred = false;

    for (const tableData of tablesData) {
      const className = Object.keys(tableData[0])[0].replace('class-table ', '').replace('-table active-table', '');

      await conn.beginTransaction();

      try {
        await conn.execute('DELETE FROM randomizer WHERE file_id = ? AND class_name = ?', [file_id, className]);

        for (const studentData of tableData.slice(1)) {
          const values = [className, file_id, ...studentData];
          await conn.execute('INSERT INTO randomizer (class_name, file_id, order_id, rider_id, rider_name, rider_school, horse_name, horse_provider) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', values);
        }

        await conn.commit();
      } catch (error) {
        await conn.rollback();
        console.error('Failed to insert student data:', error);
        res.status(400).send({ errorMessage: 'Failed to save randomizer data' });
        errorOccurred = true;
        break; // Exit the loop immediately if an error occurs
      }
    }

    if (!errorOccurred) {
      console.log('Randomized data inserted successfully');
      res.status(200).send({ message: 'Data saved successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error });
  } finally {
    conn.release();
  }
}


const getRandomizer = async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT r.*, f.filename
          FROM (
              SELECT MAX(file_id) AS latest_file_id
              FROM randomizer
          ) AS latest_randomizer
          LEFT JOIN randomizer AS r ON r.file_id = latest_randomizer.latest_file_id
          LEFT JOIN files AS f ON r.file_id = f.file_id;
      `);

      const randomizerData = result[0];
      res.status(200).json({ list : randomizerData });
  } catch (error) {
      console.error('Failed to fetch randomizer data:', error);
      res.status(500).json({ errorMessage: 'Failed to fetch randomizer data' });
  }
};




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

const addFolder = async (req,res) => {
  try{
    const { folder } = req.body;
    console.log(folder);
    if (!folder) {
      res.json({ errorMessage: "enter folder name", status: false });
    } else {
      const insertQuery =
        "INSERT INTO folders (folder_name) VALUES (?)";
      let [add] = await pool.query(insertQuery, [folder]);
      console.log(add)
      if (add.affectedRows > 0) {
        res.status(201).json({ message: "Folder added successfully" });
      } else {
        res.status(201).json({ errorMessage: "An error occurred while adding folder" });
      }
      
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "An error occurred while adding folder"});
  }
}


const deleteFolder = async (req,res) =>{
  const { folder_id } = req.query;
  try{
    if(folder_id){
      const imagesDeleteQuery = "DELETE FROM images WHERE folder_id = ? ";
      const folderDeleteQuery = "DELETE FROM folders WHERE folder_id = ? ";
      const [result1] = await pool.execute(imagesDeleteQuery, [folder_id]);
      const [result] = await pool.execute(folderDeleteQuery, [folder_id]);
    console.log(result1 , result);
    if (result.affectedRows > 0 & result1.affectedRows > 0) {
      res.status(201).json({message : "Deleted Successfully"});
    } else {
      res.status(400).json({errorMessage : "Failed to delete"});
    }
  } else {
    res.status(400).json({errorMessage : "Failed to delete"});
  }
  } catch(err){
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
}

const getFolders = async (req,res) => {
  try{
    const fetchQuery = "SELECT * FROM folders";
    const fetchImages = "SELECT * FROM images"
    const [folders] = await pool.execute(fetchQuery);
    const [images] = await pool.execute(fetchImages);
    if (folders.length == 0) {
      res.status(401).json({ errorMessage: "Empty folders" });
    } else {
     // console.log(folders, images)
      res.status(201).json({folders : folders, images : images});
    }

  } catch (err) {
    res.status(500).json({ errorMessage: err});
  }

}

const addImage = async (req,res) => {
  try{
    console.log(req.file, req.body.folder_id)
    if(req.file && req.body.folder_id){
        console.log("Image data recieved from cloudinary");
        const { path:  url } = req.file;
        const image = { url };
        const addQuery = "INSERT INTO images (image_url,folder_id) VALUES (?,?)";
        const [folders] = await pool.execute(addQuery, [image.url,req.body.folder_id]);
        if(folders.affectedRows > 0){
          res.status(201).json({message : "Image added Successfully"});
        } else {
          res.status(500).json({ errorMessage: "Failed to upload image"});
        }
        }
  } catch (err) {
    res.status(500).json({ errorMessage: err});
  }
}

module.exports = {
  login,
  showAdminLogin,
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
  sendOTP,
  checkOTP,
  changePassword,
  getRandomizer,
  getAdmins,
  addShowAdmin,
  editShowAdmin,
  deleteShowAdmin,
  addFolder,
  deleteFolder,
  getFolders,
  addImage
};
