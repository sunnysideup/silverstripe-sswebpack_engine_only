cd themes/sswebpack_engine_only/
npm run build --theme_dir=themes/mytheme
cd -

# gzip mytheme for extra fast delivery
sudo rm themes/mytheme/dist/*.gz -rf

# sudo rm themes/mytheme/dist/vendors~app.js -rf
gzip themes/mytheme/dist/app.css        themes/mytheme/dist/app.css.gz
gzip themes/mytheme/dist/app.js         themes/mytheme/dist/app.js.gz
gzip themes/mytheme/dist/vendors~app.js themes/mytheme/dist/vendors~app.js.gz

#############################
# my theme
#############################
cd themes/sswebpack_engine_only/
npm run build --theme_dir=vendor/myvendor/mypackage/client
cd -

# gzip mytheme for extra fast delivery
sudo rm vendor/myvendor/mypackage/client/dist/*.gz -rf

# sudo rm vendor/myvendor/mypackage/client/dist/vendors~app.js -rf
gzip vendor/myvendor/mypackage/client/dist/app.css           vendor/myvendor/mypackage/client/dist/app.css.gz
gzip vendor/myvendor/mypackage/client/dist/app.js            vendor/myvendor/mypackage/client/dist/app.js.gz
