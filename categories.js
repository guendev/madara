require('dotenv').config()
const db = require('./database')
db.connect()
const Category = require('./models/Category')
;(async function () {
  const list = [
    'Action',
    'Adventure',
    'Anime',
    'Chuyển Sinh',
    'Cổ Đại',
    'Comedy',
    'Comic',
    'Cooking',
    'Doujinshi',
    'Drama',
    'Ecchi',
    'Fantasy',
    'Gender Bender',
    'Harem',
    'Historical',
    'Horror',
    'Josei',
    'Live action',
    'Manga',
    'Manhua',
    'Manhwa',
    'Martial Arts',
    'Mature',
    'Mecha',
    'Mystery',
    'Ngôn Tình',
    'One shot',
    'Psychological',
    'Romance',
    'School Life',
    'Sci-fiSeinen',
    'Shoujo',
    'Shoujo Ai',
    'Shounen',
    'Shounen Ai',
    'Slice of Life',
    'Smut',
    'Soft Yaoi',
    'Soft Yuri',
    'Sports',
    'Supernatural',
    'Tạp chí truyện tranh',
    'Thiếu Nhi',
    'Tragedy',
    'Trinh Thám',
    'Truyện Màu',
    'Truyện scan',
    'Việt Nam',
    'Webtoon',
    'Xuyên Không'
  ]
  for (const item of list) {
    await Category.create({ name: item })
  }
})()
