const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { autoIncrement } = require('mongoose-plugin-autoinc')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'mod', 'admin']
  },
  avatar: {
    type: String,
    default: 'https://i.imgur.com/pqGLgGr.jpg'
  },
  createdAt: {
    type: Number,
    default: Date.now()
  }
})

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})

UserSchema.plugin(autoIncrement, 'User')
module.exports = mongoose.model('User', UserSchema)
