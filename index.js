
const express = require('express');
const bodyparser = require('body-parser');
const mysql = require('mysql2');
var app = express();
const cors = require('cors')

//Configuring express server
app.use(bodyparser.json());
var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions))
app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","origin,X-Requested-With,content-type,Accept");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//Configuring express server
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'studentmanagement',
  password: ''
});

connection.connect((err)=> {
    if(!err){
    console.log('Connection Established Successfully');
    }
    else
    console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
});

// API functions starts from here

app.post('/adminInsert' , (req, res) => {
  const postData = req.body;
  const query = `INSERT INTO admin(displayName,email,phoneNumber,password,status) VALUES('${postData.displayName}','${postData.email}','${postData.phoneNumber}','${postData.password}','${postData.status}')`;
  connection.query(query, postData, (err, results, fields) => {
    if (!err)
      res.send({status:'Success', code: 200, message: 'Admin created successfully'});
    else
      res.send({status:'Error', code: 500, message: 'Admin created Failed'});
  });
});

app.post('/checkAdmin' , (req, res) => {
  const postData = req.body;
   const query = `SELECT * from  admin where password = '${postData.password}' and (email = '${postData.username}' || phoneNumber = '${postData.username}' )  `;
    connection.query(query, postData, (err, results, fields) => {
       if (!err)
        res.send({status:'Success', code: 200, data: results});
      else
        res.send({status:'Error', code: 500, message: ''}); 
  }); 
});

app.post('/courseInsert' , (req, res) => {
  const postData = req.body;
  const query = `INSERT INTO course(courseName,status) VALUES('${postData.courseName}','${postData.status}')`;
  connection.query(query, postData, (err, results, fields) => {
    if (!err)
      res.send({status:'Success', code: 200, message: 'Course created successfully'});
    else
      res.send({status:'Error', code: 500, message: 'Course created Failed'});
  });
});

app.get('/viewCourse' , (req, res) => {
  connection.query('SELECT * FROM course where status = 1', (err, rows, fields) => {
    if (!err)
      res.send(rows);
    else
      console.log(err);
    }) 
});

app.post('/deleteCourse' , (req, res) => {
  const postData = req.body;
  const query = `UPDATE course set status = 0 where id = '${postData.id}' `;
  connection.query(query, postData, (err, results, fields) => {
    if (!err)
      res.send({status:'Success', code: 200, message: 'Course deleted successfully'});
    else
      res.send({status:'Error', code: 500, message: 'Course deletion Failed'});
  }); 
});

app.post('/studentInsert' , (req, res) => {
  const postData = req.body;
  const query = `INSERT INTO student(studName,courseId,status) VALUES('${postData.studName}','${postData.courseId}','${postData.status}')`;
  connection.query(query, postData, (err, results, fields) => {
    if (!err)
      res.send({status:'Success', code: 200, message: 'Student created successfully'});
    else
      res.send({status:'Error', code: 500, message: 'Student creation Failed'});
  }); 
});

app.get('/viewStudents' , (req, res) => {
  connection.query('SELECT * FROM student JOIN course where student.courseId = course.id AND student.status = 1', (err, rows, fields) => {
    if (!err)
        res.send(rows);
    else
        console.log(err);
  }) 
});

app.post('/deleteStudent' , (req, res) => {
  const postData = req.body;
  const query = `UPDATE student set status = 0 where studCode = '${postData.studCode}' `;
  connection.query(query, postData, (err, results, fields) => {
    if (!err)
      res.send({status:'Success', code: 200, message: 'Student deleted successfully'});
    else
      res.send({status:'Error', code: 500, message: 'Student deletion Failed'});
  });  
});

 app.post('/viewAStudent' , (req, res) => {
  const postData = req.body;
  const query = `SELECT * from student where studCode = '${postData.studCode}' `;
  connection.query(query, postData, (err, results, fields) => {
    res.send({status:'Success', code: 500, data: results});
  });   
}); 

app.post('/updateStudent' , (req, res) => {
  const postData = req.body;
  const query = `UPDATE student set studname = '${postData.data.studName}', courseId = '${postData.data.courseId}' where studCode = '${postData.studCode}' `;
  console.log(query);
  connection.query(query, postData, (err, results, fields) => {
    if (!err)
      res.send({status:'Success', code: 200, message: 'Student updated successfully'});
    else
      res.send({status:'Error', code: 500, message: 'Student updation Failed'});
  });  
});



const port = 80;
app.listen(port,(req,res) => {
  console.log('Listening on port ',port);
})