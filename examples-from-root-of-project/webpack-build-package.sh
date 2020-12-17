


#############################
# my vendor package
#############################
cd themes/sswebpack_engine_only/
npm run build --theme_dir=vendor/myvendor/mypackage/client
cd -

# OPTIONAL GZIP ASSETS!
# gzip vendor for extra fast delivery
# sudo rm vendor/myvendor/mypackage/client/dist/*.gz -rf

# gzip vendor/myvendor/mypackage/client/dist/app.css           vendor/myvendor/mypackage/client/dist/app.css.gz
# gzip vendor/myvendor/mypackage/client/dist/app.js            vendor/myvendor/mypackage/client/dist/app.js.gz
# gzip vendor/myvendor/mypackage/client/dist/vendors~app.js vendor/myvendor/mypackage/client/dist/vendors~app.js.gz

cd vendor/myvendor/mypackage/
git add . -A
git commit . -m "MINOR: build"
git push
cd -
