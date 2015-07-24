// ==UserScript==
// @name         Udacity Full Page Course Viewer
// @version      0.4
// @description  Makes full page text content in the Udacity Course Viewer instead of the original 435px tall scrolling div. Moves Downloadables to main sidebar, applies HighlightJS to example code.
// @oujs:author  eosrei
// @match        https://www.udacity.com/course/viewer
// @homepage     https://github.com/eosrei/userscript-udacity-course-viewer
// @grant        GM_addStyle
// ==/UserScript==

// Remove the text content viewport scrollbars to make the text content fill the page.
GM_addStyle(".scale-media>div.reading-area { position: relative; margin-bottom: -56.25%;}");

// Disable word wrap for example code blocks and reduce fontsize to increase code visibility.
GM_addStyle("pre { word-wrap: normal; font-size: 11px; }");

// Add HighlightJS CSS/JS for code syntax highlighting.
// Change to whatever highlight style CSS you want: https://github.com/isagalaev/highlight.js/tree/master/src/styles
$("<link/>", {
    rel: "stylesheet",
    type: "text/css",
    href: "//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/styles/github-gist.min.css"
}).appendTo("head");
$.getScript('//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min.js');

// AngularJS to hijack the viewer's loadingComplete so we can run some code whenever the content is changed.
var viewerControllerElement = document.querySelector('div.viewer-player');
var viewerControllerScope = angular.element(viewerControllerElement).scope();
// Make a copy of the original loadingComplete.
var oldLoadingComplete = viewerControllerScope.loadingComplete;
// Create a new loadingComplete
viewerControllerScope.loadingComplete = function(c) {
    // Run the original code.
    oldLoadingComplete(c);
    //console.log("LoadingComplete");

    // SetTimeout is non-ideal, but it's good enough to do what we need.
    // @todo: Locate a better function so we don't need to have a timeout.
    setTimeout(function(){
        // Move Downloadables to the main sidebar under the Get Help section.
        $('div[data-supplemental-materials-list]').insertAfter('div[data-viewer-feedback]');
        //console.log("Moved Downloads");

        // Apply HighlightJS to all example code.
        $('div.viewer-player pre').each(function(i, block) {
            //console.log("Code block found");
            hljs.highlightBlock(block);
        });
    }, 100);
};

// Make column generally used for Instructor Notes fill the available width because Downloadables is moving.
GM_addStyle(".col-xs-8 { width: 100%;}");
// Make Downloadables title match Get Help formatting.
GM_addStyle("div.guided-tour-exhibit-downloadables-introduction h2 {color: #303030; font-size: 18px;}");
