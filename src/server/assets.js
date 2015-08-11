// assets to be used by the 'hapi-assets' module based on process.env.NODE_ENV
module.exports = {
    development: {
        js: ['js/lib/modernizr.js', 'js/lib/jquery.js', 'js/lib/foundation.min.js', 'js/custom/index.js'],
        css: ['css/foundation.css','css/styles.css']
    },
    production: {
        js: ['js/scripts.js'],
        css: ['css/styles.css']
    }
}