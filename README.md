# Fancuongboylove

> Project ComicToon use Nodejs, Vue(Single File Components) and Nuxt.

<p align="center">
<img src="https://i.imgur.com/ATofjdw.png">
</p>

## Features

- Laravel 7
- Bootstrap 4 + Font Awesome 5
- Login, register, email verification and password reset
- Manga Info: Genre, Tags, Rank
- Unlimited Chapters & Volumes
- Facebook Comment, Views Count
- Ajax Load Image, Responsive, Canvas Render
- Advanced Manga Search & Filter
- User Settings
- Front-end User Upload

## Database
> NOSQL - Mongodb

https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04

## .env
> You need to set up .env first. Example: [.env.example](https://github.com/dnstylish/madara/blob/master/.env.example)

## Storage - [BunnyCDN](https://bunny.net/)
BunnyCDN is the best CDN I know. See why [Review](https://www.techradar.com/reviews/bunny-cdn)
> You need to two Pull Zone

- ### Normal Pull Zone
    - Story avatar, chapter avatar, user avatar,..
    - Googlebot can crawl
    - Can share to social media
  ```
    BUNNY_STORAGE_NAME_2=
    BUNNY_STORAGE_SERVER_2=
    BUNNY_ACCESS_KEY_2=
    CDN_DOMAIN_2=
  ```
- ### Secure Pull Zone
    - Chapter content
  ```
    BUNNY_SECURITY_KEY=
    SECURE_ENABLE=
    BUNNY_STORAGE_NAME=
    BUNNY_STORAGE_SERVER=
    BUNNY_ACCESS_KEY=
    CDN_DOMAIN=
  ```
  - To use secure cdn, please set SECURE_ENABLE = 1
  - More: [How to sign URLs](https://support.bunny.net/hc/en-us/articles/360016055099-How-to-sign-URLs-for-BunnyCDN-Token-Authentication)
## Usage

```
# install npm
npm run dev

# install pm2 process manager
npm install -g pm2

# startup script
pm2 startup

# start process
pm2 start

# save process list
pm2 save

# list all processes
pm2 l

# stop process
npm stop
```

## .env
> You need to set up .env first before run project

## Scrapper Tool
> Contact [dnstylish@gmail.com](mailto:someone@yoursite.com) if you need to help.

## Backup


First, download the script:
```
curl "https://raw.githubusercontent.com/andreafabrizi/Dropbox-Uploader/master/dropbox_uploader.sh" -o dropbox_uploader.sh
```
Move script:
```
mv dropbox_uploader.sh scripts/dropbox_uploader.sh
```
Change the permissions:
```
chmod +x dropbox_uploader.sh
```
Launch the setup process:
```
./dropbox_uploader.sh
```
The script will guide you through all necessary steps to connect the remote machine with your Dropbox account. During the installation process you will be asked to navigate to your Dropbox web page, create an application and providing app key and app secret for the download script.

Edit [mongodb_backup.sh](https://github.com/dnstylish/madara/blob/3427321df9008deef2206d367d8be80761947360/mongodb_backup.sh#L18)
```
DB_NAME=YOUR_DATABASE
```
###Setting a cronjob
You can have the script executed periodically by seting a cron job. To edit the crontab file responsible for registering new cron tasks run: `crontab -e`. To perform an action at 01.45 am add this line: `45 01 * * * sh <path to the script>/mongodb_backup.sh` Save the file and check the list of your cron tasks: crontab -l More about crontab: http://v1.corenominal.org/howto-setup-a-crontab-file/

## License
- Email: dnstylish@gmail.com
- Designed by Mangabooth
