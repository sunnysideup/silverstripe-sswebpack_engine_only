# Base SilverStripe theme with a webpack build system

## Installation

 - Install this to your themes folder as sswebpack
 - Add a `themes/sswebpack_mysite` folder with  `themes/sswebpack_mysite/src/main.js` as the central file.
 - Use import statements inside this file to add other files -e.g. `import './sass/style.sass'`
 - You can access `themes/sswebpack_base` (or any other directories relating to your theme) by using `@import '~base/sass/{file}'`, however `sswebpack_mysite/src/main.js` remains the root of all includes
 - Add a `themes/sswebpack_dist` for the final output.
 - Add a `themes/sswebpack_node_modules/` to include other modules (using a package file inside that folder)
 - It requires your dev-server to be using the following url: `whatever.com.localhost` and the name of the root folder needs to be `whatever.com`.  We will try to change this!

In theory you can change the name of the theme to something other than `sswebpack`, but we have not tested this.
