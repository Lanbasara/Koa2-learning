const Answers = require('../modules/answers')
class AnswersCtl {
  async find(ctx){
    const {per_page = 10} = ctx.query 
    const page = Math.max(ctx.query.page * 1,1) - 1;
    var perPage = Math.max(per_page*1,1);
    const q = new RegExp(ctx.query.q)
    ctx.body = await Answers
    .find({ content : q, questionId : ctx.params.questionId})
    .limit(perPage).skip(page*perPage)
  }
  async findById(ctx){
    const {fields=''} = ctx.query
    const selectField = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
    const answer = await Answers.findById(ctx.params.id).select(selectField).populate('answerer')
    ctx.body = answer 
  }
  async checkanswerExist(ctx,next){
    const answer = await Answers.findById(ctx.params.id).select('+answerer')
    if(!answer){
      ctx.throw(404,'答案不存在')
    } else if(ctx.params.questionId &&  answer.questionId !== ctx.params.questionId){
      ctx.throw(404, "该问题下无此答案")
    } else{
      await next()
    }
  }
  async creat(ctx){
    ctx.verifyParams({
      content : {type : 'string', required:true},
    });
    const answer = await new Answers({...ctx.request.body,answerer:ctx.state.user._id, questionId : ctx.params.questionId}).save()
    ctx.body = answer
  }
  async update(ctx){
    ctx.verifyParams({
      content : {type : 'string', required:false},
    });
    const answer = await Answers.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = answer
  }
  async checkanswerer(ctx,next){
    const answer = await Answers.findById(ctx.params.id).populate('answerer')
    if(answer.answerer.id.toString()!==ctx.state.user._id){
      ctx.throw(403, '无权限')
    }
    await next(  )
  }
  async delete(ctx){
    await Answers.findByIdAndDelete(ctx.params.id)
    ctx.status = 204;
  }
}
module.exports = new AnswersCtl()
