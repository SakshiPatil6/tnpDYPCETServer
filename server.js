const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express()
//app.use(cors());

const multer = require('multer');
const path = require('path');

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
//app.use(express.urlencoded({ extended: true }));
// const config = {
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
//     }
//   };
//app.use(cors(config));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
})

const storageGallery = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'public/imgGallery')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const uploadGallery = multer({
    storage: storageGallery
})

const db = mysql.createConnection({
    host: 'localhost',
    user: "id21485239_root",
    password: '',
    database:'id21485239_tandp'
})

app.post('/t', (req, res) => {
    console.log(req)
    const sql = "INSERT INTO `signup`(`Username`, `Email`, `Password`) VALUES (?,?,?)";
    const values = [
        req.body.Username,
        req.body.Email,
        req.body.Password
    ]
    db.query(sql, values, (err, data) => {
        if (err) return res.json("Insertion Failed!");
        return res.json(data);
    })
})

app.post('/login', (req, res) => {
    console.log(req)
    const sqlLOGIN = "SELECT * FROM `signup` WHERE Email=? AND Password=?";
    const values = [
        req.body.Email,
        req.body.Password
    ]
    db.query(sqlLOGIN, values, (err, data) => {
        if (err) return res.json("Login Failed!");
        return res.json(data);
    })
})

app.post('/adminLogin', (req, res) => {
    console.log(req)
    const sqlLOGIN = "SELECT `code` FROM `admin` WHERE code=?";
    const values = [
        req.body.code
    ]
    db.query(sqlLOGIN, values, (err, data) => {
        console.log(data);
        console.log(data.length)
        if (err) return res.json({ code: err });
        if (data.length === 0) { 
            return res.json(false);
        } else {
            return res.json(true);
        }
    })
})

app.post('/read', (req, res) => {
    console.log(req)
    const sqlRead = "SELECT * FROM `signup`;"
    db.query(sqlRead, (err, data) => {
        if (err) return res.json({Message: "Error inside server"});
        return res.json(data);
    })
})

app.post('/readID/:id', (req, res) => {
    const sqlReadid = "SELECT * FROM `signup` WHERE id=?;"
    const id = req.params.id;
    console.log("id= ", req.params.id);
    db.query(sqlReadid,[id], (err, data) => {
        if (err) return res.json({Message: "Error inside server"});
        return res.json(data);
    })
})

app.delete('/delete/:id', (req, res) => {
    const delSQL = "DELETE FROM signup WHERE id=?;"
    const id = req.params.id;
    console.log("id= ", req.params.id);
    db.query(delSQL,[id], (err, data) => {
        if (err) return res.json({Message: "Error inside server"});
        return res.json(data);
    })
})

app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file)
    const image = req.file.filename;
    const values = [
        req.body.name,
        req.body.company,
        req.body.studDetails
    ]
    const sqlImg = "INSERT INTO `addstudplaced`(`image`, `name`, `company`, `studDetails`) VALUES (?,?,?,?);"
    db.query(sqlImg, [image, ...values], (err, result) => {
        if (err) {
            console.log(err)
            return res.json({ Message: "Error inside server" });
        }
        return res.json(result);
    });
})


app.post('/uploadImageGallery', uploadGallery.single('image'), (req, res) => {
    console.log(req.file)
    const image = req.file.filename;
    const sqlImg = "INSERT INTO `gallery`(`img`) VALUES (?);"
    db.query(sqlImg, image, (err, result) => {
        if (err) {
            console.log(err)
            return res.json({ Message: "Error inside server" });
        }
        return res.json(result);
    });
})

app.get('/readImg', (req, res) => {
    sqlImgGet = "SELECT * FROM `addstudplaced`"
    db.query(sqlImgGet, (err, result) => {
        if (err) return res.json({ Meesage: "Error" });
        else { 
            console.log(result)
            return res.json(result);
        } 
    })
})

app.get('/readImgGallery', (req, res) => {
    sqlImgGet = "SELECT * FROM `gallery`"
    db.query(sqlImgGet, (err, result) => {
        if (err) return res.json({ Meesage: "Error" });
        else { 
            console.log(result)
            return res.json(result);
        } 
    })
})

app.post('/uploadAnnouncement', (req, res) => {
    console.log(req)
    const sql = "INSERT INTO `announcement`(`a1`, `a2`, `a3`) VALUES (?,?,?)";
    const values = [
        req.body.a1,
        req.body.a2,
        req.body.a3
    ]
    db.query(sql, values, (err, data) => {
        if (err) return res.json("Insertion Failed!");
        return res.json(data);
    })
})

app.get('/readAnnouncement', (req, res) => {
    sqlAnGet = "SELECT `a1`, `a2`, `a3` FROM `announcement`";
    db.query(sqlAnGet, (err, result) => {
        if (err) return res.json({ Meesage: "Error" });
        else { 
            console.log(result)
            return res.json(result);
        } 
    })
})

app.listen(8081, () => {
    console.log("Listening...");
})
