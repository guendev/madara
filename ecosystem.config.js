module.exports = {
  apps: [
    {
      name: 'web',
      script: './bin/www',
      instances: 0,
      exec_mode: 'cluster',
      watch: true
    }
  ]
}
