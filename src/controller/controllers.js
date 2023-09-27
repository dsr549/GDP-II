const jwt = require("jsonwebtoken");
const pool = require("../pool");
const config = require("../config");
const readXlsxFile = require('read-excel-file/node');
const path = require('path');

const login = async (req, res) => {
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
    res.status(500).json({ message: err.message});
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
    const fetchQuery = "SELECT * FROM announcements";
    const [announcements] = await pool.execute(fetchQuery);
    if (announcements.length == 0) {
      res.status(401).json({ errorMessage: "Empty announcements" });
    } else {
      console.log(announcements[id]);
      if(announcements[id]){
        res.status(201).json({idAnnouncement : announcements[id]});
      }
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
    const fetchQuery = "SELECT * FROM announcements";
    const [announcements] = await pool.execute(fetchQuery);
    if (announcements.length == 0) {
      res.status(401).json({ errorMessage: "Empty announcements" });
    } else {
      console.log(announcements[id]);
      const deleteTitle = announcements[id].title;
      const deleteQuery = "DELETE FROM announcements WHERE title = ? ";
      const result = await pool.execute(deleteQuery, [deleteTitle]);
      console.log(result);
      if(result){
        res.status(201).json({message: "Deleted Successfully"});
      }
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
}

const saveAnnouncement = async (req,res) =>{

  const { title,message,username,date, previousTitle} = req.body;
  try{
    if(previousTitle){

    const query = `UPDATE announcements SET title = \'${title}\', message = \'${message}\', date = \'${date}\' WHERE title = \'${previousTitle}\';`
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
    if(classname && riderid,ridername && school && horsename && provider){

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

    const Rquery = `SELECT r.*
    FROM (
        SELECT MAX(f.file_id) AS latest_rider_id
        FROM files AS f
        WHERE f.filename LIKE '%-riders%'
    ) AS latest_rider
    LEFT JOIN riders AS r ON r.file_id = latest_rider.latest_rider_id;`;

    const Hquery = `
      SELECT h.*
      FROM (
          SELECT MAX(f.file_id) AS latest_horse_id
          FROM files AS f
          WHERE f.filename LIKE '%-horses%'
      ) AS latest_horse
      LEFT JOIN horses AS h ON h.file_id = latest_horse.latest_horse_id;
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
  const rows = await readXlsxFile(path.join(__dirname,`../router/files/${req.file.filename}`)).then((data) => {
    data.shift();
    if (data) {
      return data;
    }
  })
   // console.log(rows);
   if(rows.length > 0 ){
    const fileQuery = `INSERT INTO files (filename) VALUES(?);`;
    const [result] = await pool.query(fileQuery,[req.file.filename]);
    console.log(result.insertId);
    if(result.affectedRows == 1){

         const query = `INSERT INTO riders (file_id, riderid, name, height, weight, experience, school,placing, class, remarks) VALUES (?,?,?,?,?,?,?,?,?,?);`
         for(let i=0; i<rows.length;i++){
      
         await pool.query(query,[result.insertId,rows[i][0],rows[i][1],rows[i][2],rows[i][3],rows[i][4],rows[i][5],rows[i][6],rows[i][7],rows[i][8]]);
     
        };

    }
    res.status(200).json({success: "Uploaded Successfully"});
   }
  
} catch (err){
  console.log(err);
  res.status(500).json({ errorMessage: err });
}
}

const uploadHorse = async (req,res) => {
  // console.log(req,res);
 try{
   const rows = await readXlsxFile(path.join(__dirname,`../router/files/${req.file.filename}`)).then((data) => {
     data.shift();
     if (data) {
       return data;
     }
   })
    // console.log(rows);
    if(rows.length > 0 ){
     const fileQuery = `INSERT INTO files (filename) VALUES(?);`;
     const [result] = await pool.query(fileQuery,[req.file.filename]);
     console.log(result.insertId);
     if(result.affectedRows == 1){
 
          const query = `INSERT INTO horses (file_id, draw_order, name, provider, spur, rein_hold, remarks,class) VALUES (?,?,?,?,?,?,?,?);`
          for(let i=0; i<rows.length;i++){
       
          await pool.query(query,[result.insertId,rows[i][0],rows[i][1],rows[i][2],rows[i][3],rows[i][4],rows[i][5],rows[i][6]]);
      
         };
 
     }
     res.status(200).json({success: "Uploaded Successfully"});
    }
   
 } catch (err){
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
  uploadHorse
};
