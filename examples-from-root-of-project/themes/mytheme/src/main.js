# if you use jQuery ... 
import $ from 'jquery';
window.jQuery = $;
window.$ = jQuery;

// non-themed app --- to be tested!
import 'PROJECT_ROOT_DIR/app/client/javascript/MyJavascriptFile';


// vendor modules --- to be tested!
import 'PROJECT_ROOT_DIR/vendor/myvendor/mypackage/client/javascript/MyJavascriptFile';

// your themed app files
import "./js/partials/SomeOtherJavascriptFile";
