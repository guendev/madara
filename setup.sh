#!/bin/bash
# Ask the user for their name
echo -n "Do you want to import demo (Y/N)? "
# shellcheck disable=SC2162
read answer
if [ "$answer" != "${answer#[Yy]}" ] ;then
    echo "Unpack the demo folder"
    unzip demo.zip
    echo "Moving ads blocks"
    mv demo/ads views/includes
    mv demo/ads.text public/ads.text
    mv demo/sellers.json public/sellers.json
    echo "Moving watermark"
    mv demo/modules/image/lib modules/image
    echo "Moving favicon"
    mv demo/favicon public/images
    echo "Moving slider"
    mv demo/slider.js slider.js
    echo "Moving logo"
    mv demo/logo.svg public/images/logo.svg
    echo "Moving css"
    mv demo/css/custom.css public/css/custom.css
    echo "Remove demo directory"
    rm -r demo
    echo "Tks..."
else
    echo "You need to import demo!!!"
fi
