const express = require('express')
const app = express()
const port = 10001

let ejs = require("ejs");
let path = require("path");

// 设置模板路径
// 1.当前路径的绝对路径
app.set("views", path.resolve(__dirname, "views"));

app.set("view engine", "html");
//2.文件名后缀
app.engine(".html", ejs.__express);

// html文件 引用静态资源
app.use(express.static(path.resolve(__dirname, "public")))

app.get('/', (req, res) => {

  // res.send('Hello World!')

  // res.render("register") //1 2

  res.render('aaa')
})


app.get('/login', (req, res) => {
  res.render("login");
})

app.get('/index', (req, res) => {
  res.render("index");
})

app.get('/product', (req, res) => {
  res.render("product");
})


app.get('/forgot', (req, res) => {
  res.render("forgot");
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))