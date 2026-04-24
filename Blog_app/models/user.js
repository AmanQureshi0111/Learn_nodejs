const {createHmac,randomBytes} = require("crypto"); //to hash the password

const {Schema, model} = require('mongoose');

const {createTokenForUser,validateToken} = require('../services/authentication');

const userSchema= new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    salt:{
        type:String,
    },
    profileImageURL:{
        type:String,
        default:'../public/images/default.png'
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    }
},{timestamps:true});

userSchema.pre('save', function () {
    const user =this;
    if(!user.isModified('password')){
        return;
    }
    // salt is random string
    const salt=randomBytes(16).toString("hex");
    const hashedPassword=createHmac('sha256',salt)
        .update(user.password)
        .digest("hex")
    this.salt=salt;
    this.password=hashedPassword;
})

userSchema.static('matchPasswordAndGenerateToken', async function(email,password){
    const user = await this.findOne({ email });
    if(!user) throw new Error('Invalid email');
    const salt=user.salt;
    const hashedPassword=user.password;
    const userProvidedHashed=createHmac('sha256',salt)
        .update(password)
        .digest('hex')
    if(hashedPassword!==userProvidedHashed){
        throw new Error('Invalid password');
    }
    const token=createTokenForUser(user);
    return token;
    // const safeUser = user.toObject();
    // delete safeUser.password;
    // delete safeUser.salt;
    // return safeUser;
})

const User=model('user',userSchema);

module.exports=User;
