


#############################
# my theme
#############################

cd themes/sswebpack_engine_only/
npm run build --theme_dir=themes/mytheme
cd -

# OPTIONAL GZIP ASSETS!
# gzip mytheme for extra fast delivery
# sudo rm themes/mytheme/dist/*.gz -rf

# sudo rm themes/mytheme/dist/vendors~app.js -rf
# gzip themes/mytheme/dist/app.css        themes/mytheme/dist/app.css.gz
# gzip themes/mytheme/dist/app.js         themes/mytheme/dist/app.js.gz
# gzip themes/mytheme/dist/vendors~app.js themes/mytheme/dist/vendors~app.js.gz

git add . -A
git commit . -m "MINOR: front-end build"
git push
cd -
