const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessagesSchema = new Schema({
    to:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    from:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    conversation_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
    },
    message:
    {
        type: String,
        default: null,
        required: true,

    },
    created_time:
    {
        type : Date, 
        default: Date.now,
    },
})

const ConversationSchema = new Schema
({
     _id:
     {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    subject: 
    {
        type: String,
        required: true,
        
    },
})
    const Msg = mongoose.model('message_details', MessagesSchema)
    module.exports = Msg 
