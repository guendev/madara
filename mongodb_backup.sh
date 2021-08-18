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
DB_NAME=

function mongodb_dump
{
  # Name of the compressed file
  FILE="${DIR}${DB_NAME}_${NOW}.tar.gz"

  # Dump the database
  mongodump -d $DB_NAME -o $DIR

  # Compress
  tar -zcvf "$FILE" $DIR$DB_NAME

  # Remove the temporary database dump directory
  rm -fr $DB_NAME

  # Upload the file
  $UPLOADER_SCRIPT upload "$FILE" $TARGET_DIR

  # Remove the file
  rm "$FILE"
}

mongodb_dump
