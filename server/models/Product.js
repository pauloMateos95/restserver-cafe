const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'El nombre es necesario'] 
    },
    price: { 
        type: Number, 
        required: [true, 'El precio únitario es necesario'] 
    },
    desc: { 
        type: String, 
        required: false 
    },
    available: { 
        type: Boolean, 
        required: true, 
        default: true 
    },
    category: { 
        type: Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }
});


module.exports = model('Product', productSchema);