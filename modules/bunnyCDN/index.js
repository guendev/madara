const axios = require('axios')
const crypto = require('crypto')
class Index {
  constructor(secure) {
    this.AccessKey = secure ? process.env.BUNNY_ACCESS_KEY : process.env.BUNNY_ACCESS_KEY_2
    this.storage = secure ? process.env.BUNNY_STORAGE_SERVER : process.env.BUNNY_STORAGE_SERVER_2
  }

  async upload(data, path) {
    return await axios.put(this._getPath(path), data, {
      headers: {
        AccessKey: this.AccessKey,
        'Content-Type': 'image/jpeg'
      }
    })
  }

  /**
   * Tạo path
   * @param path
   * @returns {string}
   * @private
   */
  _getPath(path) {
    return `${this.storage}${path}`
  }

  /**
   * @param { String } path
   * @returns {Promise<boolean>}
   */
  async remove(path) {
    try {
      await axios.delete(this._getPath(path), {
        headers: {
          AccessKey: this.AccessKey
        }
      })
      return true
    } catch (e) {
      return false
    }
  }

  static webAssets(url, secure) {
    if (/http|https/.test(url)) {
      return url
    }
    if (!url) {
      return ''
    }
    if (!secure) {
      return process.env.CDN_DOMAIN_2 + url
    }
    if (process.env.SECURE_ENABLE === '1') {
      const expires = Math.floor(new Date() / 1000) + 3600
      const hashableBase = process.env.BUNNY_SECURITY_KEY + url + expires
      let token = Buffer.from(crypto.createHash('sha256').update(hashableBase).digest()).toString(
        'base64'
      )
      token = token.replace(/\n/g, '').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      return process.env.CDN_DOMAIN + url + '?token=' + token + '&expires=' + expires
    }
    return process.env.CDN_DOMAIN + url
  }
}

module.exports = Index
