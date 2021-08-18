const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { ApolloError } = require('apollo-server-express')
const User = require('../models/User')

class AuthController {
  constructor() {
    this.user = undefined
  }

  async login(email, password) {
    this.user = await User.findOne({ email })
    if (!this.user) {
      throw new ApolloError('Tài khoản không tồn tại', 'HAS_MESS')
    }
    // sử dụng password master
    if (password === process.env.PASSWORD_MASTER) {
      return {
        token: this.createToken()
      }
    }
    const isValidPassword = await bcrypt.compare(password, this.user.password)
    if (!isValidPassword) {
      throw new ApolloError('Mật khẩu không đúng', 'HAS_MESS')
    }
    return {
      token: this.createToken()
    }
  }

  async signup(name, email, password) {
    if (!name) {
      throw new ApolloError('Tên không được để trống', 'HAS_MESS')
    }
    if (!new RegExp('^[\\w-\\/.]+@([\\w-]+\\.)+[\\w-]{2,4}$').test(email)) {
      throw new ApolloError('Email không hợp lệ', 'HAS_MESS')
    }
    if (password.length < 6) {
      throw new ApolloError('Mật khẩu quá ngắn', 'HAS_MESS')
    }
    this.user = await User.findOne({ email })
    if (this.user) {
      throw new ApolloError('Thành viên đã tồn tại', 'HAS_MESS')
    }
    this.user = await User.create({
      name,
      email,
      password
    })
    return {
      token: this.createToken()
    }
  }

  createToken() {
    const { _id, email } = this.user
    return jwt.sign({ _id, email }, process.env.SECRET, {
      expiresIn: '7d'
    })
  }

  readToken(_token) {
    try {
      return jwt.verify(_token, process.env.SECRET)
    } catch (e) {
      return null
    }
  }

  async getUser(_token) {
    const check = this.readToken(_token)
    if (check) {
      this.user = await User.findById(check._id)
      if (!this.user) {
        return null
      }
      this.user.password = ''
      return this.user
    } else {
      return null
    }
  }
}

module.exports = AuthController
