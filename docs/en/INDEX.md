# Base SilverStripe theme with a webpack build system

## Installation

 - Install this to your themes folder as `sswebpack_engine_only` (composer should do this automatically)
 - See the `examples` folder for the files you need to create. Remove the `.example` extension and add in the same structure as the example.  
 - Your theme name can be anything.  We use `mytheme` as an example name.
 - You can access `themes/mytheme` (or any other directories relating to your theme) by using `@import '~base/sass/{file}'`, by default `mytheme_app/src` is the root of all includes.
 - the `init.js` and `style.scss` show you to include JS and CSS from other parts. 
 - Add a `themes/mytheme_dist` for the final output.
 - Add a `themes/mytheme_node_modules/` to include other modules (using a package file inside that folder)

## Further Notes
jquery.browser is inluded as a dependency as it is no longer included in the latest version of jQuery
we include this because it is required on the ecommerce payment form to ensure auto submit is only done for non IE browsers

# Huge THANK YOU to:

Andrew Haine:
https://github.com/AndrewHaine/silverstripe-webpack-theme
