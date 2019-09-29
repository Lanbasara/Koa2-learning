const jsonwebtoken = require('jsonwebtoken')
const User = require('../modules/users')
const { secret } = require('../config')
class UserCtl {
  async checkOwner(ctx,next){
    if(ctx.params.id !== ctx.state.user._id){
      ctx.throw(403,'没有授权')
    }
    await next()
  }
  async index(ctx) {
    ctx.body = await User.find()
  }
  async insertUser(ctx) {
    ctx.verifyParams({
      name : {type : 'string', required : true},
      password : {type : 'string', required : true},
    })
    const { name } = ctx.request.body
    const repeatedUser = await User.findOne({ name });
    if(repeatedUser){
      ctx.throw(409,'已经存在该用户')
    }
    const newUser = await new User(ctx.request.body).save()
    ctx.body = newUser
  }
  async getUserById(ctx) {
    const { fields='' } = ctx.query;
    const selectFields = fields.split(';').filter(f => f).map(f => ' +'+f).join('')
    const user = await User.findById(ctx.params.id).select(selectFields)
    if(!user){
      ctx.throw(404, '用户不存在')
    } else {
      ctx.body = user
    }
  }
  async changeUserInfo(ctx) {
    ctx.verifyParams({
      name : {type : 'string', required : false},
      password : {type : 'string', required : false},
      avatar_url : {type:'string',required:false},
      gender : {type : 'string', required :false},
      headline : {type : 'string',required :false},
      locations : {type : 'array', itemType : 'string', required : false},
      business : {type : 'string',required :false},
      employments : {type : 'array', itemType : 'object',required : false},
      employments : {type : 'array', itemType : 'object',required : false},
    })
    const user = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    if(!user){
      ctx.throw(404,'用户不存在')
    }
    ctx.body = user
  }
  async deleteUserbyId(ctx){
    const user = await User.findByIdAndRemove(ctx.params.id);
    if(!user){
      ctx.throw(404)
    }
    ctx.status = 204
  }
  async login(ctx){
    ctx.verifyParams({
      name : {type : 'string', required : true},
      password : {type : 'string', required : true}
    })
    const user = await User.findOne(ctx.request.body)
    if(!user){
      ctx.throw(401, '用户名或密码不正确')
    }
    const {_id, name} = user
    const token = jsonwebtoken.sign({_id,name}, secret, {expiresIn : '1d'});
    ctx.body = { token }

  }
}
module.exports = new UserCtl()