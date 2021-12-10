// ==UserScript==
// @name         Youtube quick share
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Rem-02
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    var fistExec = true;
    // Add the quick share button
    function putButton() {
        // Remove previous button if there is one
        if (document.getElementById("quick-share")) {
            document.getElementById("quick-share").remove();
        }
        let newDiv = document.createElement("div");
        newDiv.style.color = "white";
        newDiv.style.backgroundColor = "gray";
        newDiv.style.border = "solid";
        newDiv.style.textAlign = "center";
        newDiv.style.cursor = "pointer";
        newDiv.textContent = "Quick Share";
        newDiv.id = "quick-share";

        function quickShare() {
            const urlParams = new URLSearchParams(window.location.search);
            GM_setClipboard("https://youtu.be/" + urlParams.get("v"), "text");
            console.log("YQS copied");
            // Change style
            newDiv.style.backgroundColor = "DarkSeaGreen";
            newDiv.textContent = "Copied !";
            setTimeout(function(){
                // Revert style change
                newDiv.style.backgroundColor = "gray";
                newDiv.textContent = "Quick Share";
            }, 1000);
        }
        newDiv.addEventListener('click', quickShare, false);
        document.getElementById("above-the-fold").prepend(newDiv);
        console.log("YQS loaded");
    }

    // Search for the Share Bar
    function searchShareBar() {
        if (!window.location.href.includes("watch") /*|| document.getElementById("quick-share")*/) {
            // Not on a video or button already there -> exit
            return;
        }
        console.log("YQS Search Share Bar...");
        if (document.getElementById("above-the-fold") == null) {
            console.log("YQS Bar not found, wait more");
            setTimeout(searchShareBar, 500);
        } else {
            console.log("YQS Bar found");
            putButton();
        }
    }

    // On URL change reload the button
    // select the target node
    var target = document.querySelector('title');
    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
        // We need only first event and only new value of the title
        if (!fistExec) {
            setTimeout(searchShareBar, 500);
        }
    });
    // configuration of the observer:
    var config = { subtree: true, characterData: true, childList: true };
    // pass in the target node, as well as the observer options
    observer.observe(target, config);

    // Run once
    setTimeout(searchShareBar, 500);
    setTimeout(function(){fistExec = false;}, 500);
})();