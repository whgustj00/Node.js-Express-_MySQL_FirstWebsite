const express = require('express')
const ejs = require('ejs')
var cors = require('cors')
var bodyParser = require('body-parser')
const mysql  = require('mysql');
const app = express()
const port = 3000

// MySQL 연결 세팅
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'chol9716',
  database : 'world'
});

connection.connect();

connection.query('SELECT * from contact', (error, row, fields) => {
  if (error) throw error;
  console.log('User info is: ', row);
});

app.get('/sound/:name', (req, res) => {
    const { name } = req.params;

    if(name=='dog'){
        res.json({'sound':'멍멍'})
    } else if(name=='cat'){
        res.json({'sound':'야옹'})
    } else if(name=='pig'){
        res.json({'sound':'꿀꿀'})
    } else{
        res.json({'sound':'알수없음'})
    }
})

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false}))


// 라우팅

app.get('/home', (req, res) => {
    res.render('index')     //./views/index.ejs
})

app.get('/profile', (req, res) => {
    res.render('profile')
})

app.get('/map', (req, res) => {
    res.render('map')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.post('/contactProc', (req, res) => {
    const { name, phone, email, memo } = req.body;

    var sql = `insert into contact(name, phone, email, memo, regdate)
    values('${name}','${phone}','${email}','${memo}',now())`;

    connection.query(sql, (err, result) => {
        if(err) throw err;
        console.log('자료 1개를 삽입했습니다.');
        res.send("<script>alert('문의사항이 등록되었습니다.'); location.href='/home';</script>");
  });
})

app.get('/delete', (req, res) => {
    res.render('delete')
})

app.post('/deleteProc', (req, res) => {

    var sql = `delete from contact`;

    connection.query(sql, (err, result) => {
        if(err) throw err;
        console.log('삭제했습니다.');
        res.send("<script>alert('문의사항이 삭제되었습니다.'); location.href='/home';</script>");
  });
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/write', (req, res) => {
    res.sendFile(__dirname + '/write.html')
})

app.listen(port, () => { 
    console.log(`Example app listening on port ${port}`)
})

process.on('SIGINT', () => {
    connection.end((err) => {
      if (err) {
        console.error('Error closing MySQL connection: ', err);
      } else {
        console.log('MySQL connection closed.');
      }
      process.exit();
    });
  });