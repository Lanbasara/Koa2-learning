const Comments = require('../modules/comments')
class CommentsCtl {
  async find(ctx){
    const {per_page = 10} = ctx.query 
    const page = Math.max(ctx.query.page * 1,1) - 1;
    var perPage = Math.max(per_page*1,1);
    const q = new RegExp(ctx.query.q)
    const { questionId, answerId } = ctx.params;
    const { rootCommentId } = ctx.query
    ctx.body = await Comments
    .find({ content : q, questionId, answerId, rootCommentId })
    .limit(perPage).skip(page*perPage)
    .populate('commentator replyTo')
  }
  async findById(ctx){
    const {fields=''} = ctx.query
    const selectField = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
    const comment = await Comments.findById(ctx.params.id).select(selectField).populate('commentator')
    ctx.body = comment 
  }
  async checkcommentExist(ctx,next){
    const comment = await Comments.findById(ctx.params.id).select('+commentator')
    if(!comment){
      ctx.throw(404,'评论不存在')
    } else if(ctx.params.questionId &&  comment.questionId !== ctx.params.questionId){
      ctx.throw(404, "该问题下无此评论")
    } else if(ctx.params.answerId && comment.answerId !== ctx.params.answerId){
      ctx.throw(404, "该回答下无此评论")
    } else {
      await next()
    }
  }
  async creat(ctx){
    ctx.verifyParams({
      content : {type : 'string', required:true},
      rootCommentId : {type : 'string', required:false},
      replyTo : {type : 'string', required:false},
    });
    const comment = await new Comments(
      {...ctx.request.body,commentator:ctx.state.user._id, questionId : ctx.params.questionId, answerId : ctx.params.answerId
      }).save()
    ctx.body = comment
  }
  async update(ctx){
    ctx.verifyParams({
      content : {type : 'string', required:false},
    });
    const { content } = ctx.request.body
    const comment = await Comments.findByIdAndUpdate(ctx.params.id, {content})
    ctx.body = comment
  }
  async checkcommentator(ctx,next){
    const comment = await Comments.findById(ctx.params.id).populate('commentator')
    if(comment.commentator.id.toString()!==ctx.state.user._id){
      ctx.throw(403, '无权限')
    }
    await next(  )
  }
  async delete(ctx){
    await Comments.findByIdAndDelete(ctx.params.id)
    ctx.status = 204;
  }
}
module.exports = new CommentsCtl()