const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  __v : {type: Number, select:false},
  name : {type : String, required : true },
  // 隐藏密码
  password : {type : String,required:true, select : false},
  avatar_url : { type : String },
  gender : { type : String, enum : ['male','female'], default : 'male', required : true },
  headline : { type : String },
  locations : { type : [{ type : Schema.Types.ObjectId, ref : "Topics" }],select:false},
  business : { type : Schema.Types.ObjectId, ref : "Topics",select:false },
  employments : { 
    type : [{
      company : { type : Schema.Types.ObjectId, ref : "Topics" },
      job : { type : Schema.Types.ObjectId, ref : "Topics" }
    }],
    select:false
  },
  educations : {
    type : [
      {
        school : { type : Schema.Types.ObjectId, ref : "Topics" },
        major : { type : Schema.Types.ObjectId, ref : "Topics" },
        diploma : { type : Number , enum : [1,2,3,4,5]},
        entrance_year : { type : Number },
        gratuation_year : { type : Number },
      }
    ],
    select:false
  },
  following : {
    type : [
      // 可以ref自己
      {type : Schema.Types.ObjectId, ref : "User"}
    ],
    select : false
  },
  followingTopics : {
    type : [
      {type : Schema.Types.ObjectId, ref: 'Topics'}
    ],
    select : false
  },
  likingAnswers : {
    type : [
      { type : Schema.Types.ObjectId, ref :'Answers'}
    ],
    select : false
  },
  dislikingAnswers : {
    type : [
      { type : Schema.Types.ObjectId, ref :'Answers'}
    ],
    select : false
  },
  collectingAnswers : {
    type : [
      { type : Schema.Types.ObjectId, ref :'Answers'}
    ],
    select : false
  }
},{timestamps:true});

module.exports = model('User', userSchema);

