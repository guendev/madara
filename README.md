# Madara

> Project ComicToon use Nodejs, Vue(Single File Components) and Nuxt.

<p align="center">
<img src="https://i.imgur.com/ATofjdw.png">
</p>

## Features
- Nodejs, NOSQL, VueJS, Graphql
- Bootstrap 4 + Font Awesome 5
- Login, register, email verification and password reset
- Manga Info: Genre, Tags, Rank
- Unlimited Chapters & Volumes
- Facebook Comment, Views Count
- Ajax Load Image, Responsive, Canvas Render
- Advanced Manga Search & Filter
- User Settings
- Front-end User Upload

## Setup Server
- Reverse proxy: [Nginx](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04)
- Database: [Mongodb](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04)
- [Nodejs](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04) - Option 2


## .env
> You need to set up .env first. Example: [.env.example](https://github.com/dnstylish/madara/blob/master/.env.example)

## Storage - [BunnyCDN](https://bunny.net/)
BunnyCDN is the best CDN I know. See why: [Review](https://www.techradar.com/reviews/bunny-cdn)

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

## Watermark
To change watermark, please replace files in `modules/image/lib`

## Ads
- Auto Ads `views/inclues/ads/auto.ejs`
- Block `views/inclues/ads/block.ejs`
> You can turn off ads for per manga, page,...

## Studio: [Madara - Studio](https://github.com/dnstylish/madara-studio)
- Front end user upload
- Show/Hide Ads by Story
- Chapter thumbnail, chapter scheduler
- Crop Image, Auto upload and remove in CDN when create/update/delete
- Role, permission

## Scrapper Tool
> Contact [dnstylish@gmail.com](mailto:someone@yoursite.com) if you need to help.

## Backup


Maintaining even a small mongodb application in production requires regular backups of remotely stored data. MongoDB gives you [three ways](http://docs.mongodb.org/manual/core/backups/) to acomplish it. In this post I'm using `monogodump` command for creating a backup and `mongorestore` for recreating the data.
The purpose of this writing is to provide a simple way of periodic database dumps from a remote server to a Dropbox cloud storage.

> Remember that for using `mongodump` you have to have a `mongod` process running.

### Dumping a database

Suppose that you want make a backup of your `books` database.

To create a dump use `mongodump -d books -o <destination_folder>` which will result in a `book` folder containing bson files with all collections.
For backup purposes we will compress it all to one file:
`tar -zcvf books.tar.gz books/`.

### Dropbox uploader

To send the backup of the database to your Drobpox cloud storage install [dropbox uploader script](https://github.com/andreafabrizi/Dropbox-Uploader) on the remote server:

First, download the script:
```
curl "https://raw.githubusercontent.com/andreafabrizi/Dropbox-Uploader/master/dropbox_uploader.sh" -o dropbox_uploader.sh
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

After a successfull installation you can try out the connection uploading the `books`:
```
/root/downloads/dropbox_uploader.sh upload books.tar.gz /
```

The ending slash means that the file will be uploaded to the root directory of your Dropbox application.

The complete script for creating an archive and uploading, let's name it `mongodb_upload.sh`:

```bash
#!/usr/bin/env bash

#Get current date
NOW="$(date +'%d-%m-%Y_%H-%M')"

# Settings:

# Path to a temporary directory
DIR=~/mongodb_dump/

# Path to the target dropbox directory
TARGET_DIR=/

# Path do dropbox_uploader.sh file
UPLOADER_SCRIPT=/root/scripts/dropbox_uploader.sh

# Name of the database
DB_NAME=books

function mongodb_dump
{
  # Name of the compressed file
  FILE="${DIR}${DB_NAME}_${NOW}.tar.gz"

  # Dump the database
  mongodump -d $DB_NAME -o $DIR

  # Compress
  tar -zcvf $FILE $DIR$DB_NAME

  # Remove the temporary database dump directory
  rm -fr $DB_NAME

  # Upload the file
  $UPLOADER_SCRIPT upload $FILE $TARGET_DIR

  # Remove the file
  rm $FILE
}

mongodb_dump
```

After running the script navigate to your Dropbox `Applications` folder and look for a folder named after the application you created during the installation process. The `books.tar.gz` file should be there already.

### Setting a cronjob

You can have the script executed periodically by seting a cron job. To edit the crontab file responsible for registering new cron tasks run: `crontab -e`.
To perform an action at 01.45 am add this line:
`45 01 * * * <path to the script>/mongo_upload.sh`
Save the file and check the list of your cron tasks: `crontab -l`
More about crontab: http://v1.corenominal.org/howto-setup-a-crontab-file/

### Restoring a backup
To restore the data uncompress the file and run:
`mongorestore --drop -d <database-name> <directory-of-dumped-backup>`

## License
- Email: contact@guen.dev
- Designed by Mangabooth
