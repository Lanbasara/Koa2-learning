const Questions = require('../modules/questions')
class QuestionsCtl {
  async find(ctx){
    const {per_page = 10} = ctx.query 
    const page = Math.max(ctx.query.page * 1,1) - 1;
    var perPage = Math.max(per_page*1,1);
    const q = new RegExp(ctx.query.q)
    ctx.body = await Questions
    .find({ $or : [{title:q},{description : q}] })
    .limit(perPage).skip(page*perPage)
  }
  async findById(ctx){
    const {fields=''} = ctx.query
    const selectField = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
    const question = await Questions.findById(ctx.params.id).select(selectField).populate('questioner topics')
    ctx.body = question 
  }
  async checkQuestionExist(ctx,next){
    const question = await Questions.findById(ctx.params.id).select('+questioner')
    if(!question){
      ctx.throw(404,'问题不存在')
    } else{
      await next()
    }
  }
  async creat(ctx){
    ctx.verifyParams({
      title : {type : 'string', required:true},
      description : {type : 'string',required:false},
    });
    const question = await new Questions({...ctx.request.body,questioner:ctx.state.user._id}).save()
    ctx.body = question
  }
  async update(ctx){
    ctx.verifyParams({
      title : {type : 'string', required:false},
      description : {type : 'string',required:false},
    });
    const question = await Questions.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = question
  }
  async checkQuestioner(ctx,next){
    const question = await Questions.findById(ctx.params.id).populate('questioner')
    if(question.questioner._id.toString()!==ctx.state.user._id){
      ctx.throw(403, '无权限')
    }
    await next(  )
  }
  async delete(ctx){
    await Questions.findByIdAndDelete(ctx.params.id)
    ctx.status = 204;
  }
  // async listTopicsFollowers(ctx){
  //   const users = await User.find({followingTopics : ctx.params.id})
  //   ctx.body = users
  // }
}
module.exports = new QuestionsCtl()