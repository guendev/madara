#!/bin/bash
# Ask the user for their name
echo -n "Do you want to import demo (Y/N)? "
# shellcheck disable=SC2162
read answer
if [ "$answer" != "${answer#[Yy]}" ] ;then
   sudo apt-get install zip unzip
    echo "Unpack the demo folder"
    unzip demo.zip
    echo "Moving ads blocks"
    rsync -a demo/ads views/includes
    rsync -a demo/ads.text public/ads.text
    rsync -a demo/sellers.json public/sellers.json
    echo "Moving watermark"
    rsync -a demo/modules/image/lib modules/image
    echo "Moving favicon"
    rsync -a demo/favicon public/images
    echo "Moving slider"
    rsync -a demo/slider.js slider.js
    echo "Moving logo"
    rsync -a demo/logo.svg public/images/logo.svg
    echo "Moving css"
    rsync -a demo/css/custom.css public/css/custom.css
    echo "Remove demo directory"
    rm -r demo
    echo "Tks..."
else
    echo "You need to import demo!!!"
fi
