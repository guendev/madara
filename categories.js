require('dotenv').config()
const db = require('./database')
const Category = require('./models/Category')
db.connect()
;(async function () {
  ;['Đam Mỹ', 'Ngôn Tình', 'Harem', 'Drama', 'Học Đường', 'Cổ Trang', 'Rùng Rợn'].forEach(
    (value) => {
      return Category.create({ name: value })
    }
  )
})()
