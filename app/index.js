const Koa = require('koa');
const mongoose = require('mongoose')
var koaBody = require('koa-body');
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const routing = require('./routes')
const koaStatic = require('koa-static')
const path = require("path")
const app = new Koa();
const {connectionStr} = require('./config')
mongoose.connect(connectionStr, 
  { useNewUrlParser: true, useUnifiedTopology: true }, 
  ()=>{console.log('mongobd link success!')}
)
mongoose.connection.on('error',console.error);
// 注入中间件
app.use(koaStatic(path.join(__dirname,'./public')))
app.use(error({
  postFormat : (e, {stack,...rest}) => 
    process.env.NODE_ENV === 'production' ? {...rest} : {stack,...rest}
}))
app.use(koaBody({
  multipart : true,
  formidable : {
    uploadDir : path.join(__dirname,'./public/uploads'),
    keepExtensions : true
  }
}));
app.use(parameter(app))
routing(app)
app.listen(3333,()=>{
  console.log('server is starting at 3333')
})