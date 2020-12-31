const { Schema, model } = require('mongoose');


const categorySchema = new Schema({

    desc: {
        type: String,
        unique: true,
        required: [true, 'A description is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

module.exports = model('Category', categorySchema);