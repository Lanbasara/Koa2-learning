const Topics = require('../modules/topics')
const Questions = require('../modules/questions')
const User = require('../modules/users')
class TopicsCtl {
  async find(ctx){
    const {per_page = 10} = ctx.query 
    const page = Math.max(ctx.query.page * 1,1) - 1;
    var perPage = Math.max(per_page*1,1);
    ctx.body = await Topics
    .find({name : new RegExp(ctx.query.q)})
    .limit(perPage).skip(page*perPage)
  }
  async findById(ctx){
    const {fields=''} = ctx.query
    const selectField = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
    const topics = await Topics.findById(ctx.params.id).select(selectField)
    ctx.body = topics 
  }
  async checkTopicExist(ctx,next){
    const topic = await Topics.findById(ctx.params.id)
    if(!topic){
      ctx.throw(404,'话题不存在')
    } else{
      await next()
    }
  }
  async creat(ctx){
    ctx.verifyParams({
      name : {type : 'string', required:true},
      avatar_url : {type : 'string',required:false},
      introduction : {type:'string', required:false}
    });
    const topics = await new Topics(ctx.request.body).save()
    ctx.body = topics
  }
  async update(ctx){
    ctx.verifyParams({
      name : {type : 'string', required:false},
      avatar_url : {type : 'string',required:false},
      introduction : {type:'string', required:false}
    });
    const topics = await Topics.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = topics
  }
  async listTopicsFollowers(ctx){
    const users = await User.find({followingTopics : ctx.params.id})
    ctx.body = users
  }
  async listQuestions(ctx){
    const questions = await Questions.find({topics : ctx.params.id})
    ctx.body = questions
  }
}
module.exports = new TopicsCtl()