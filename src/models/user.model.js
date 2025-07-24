import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name:{
        required: true,
        type: String
    },
    last_name: {
        required: true,
        type: String
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    age:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true,
    },
    cart:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role:{
        type:String,
        default: 'user',
        enum: ['user', 'admin']
    }
    
});

const userModel = mongoose.model('usuarios', userSchema);

export default userModel;