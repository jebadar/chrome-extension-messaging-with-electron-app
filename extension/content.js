(function () {
    // Send a message to the background script
    communicateWithNativeApp();
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            // clearInterval(inter)
        } else {
            communicateWithNativeApp()
        }
    });
    let inter = null;
    function communicateWithNativeApp() {
        inter = setInterval(function () {
            if (document.hidden) return;
            chrome.runtime.sendMessage({ name: "native", data: { "msg": "record" } }, (response) => {
                if (response && response["record"] == "true" && localStorage.getItem("record") != "true") {
                    localStorage.setItem("record", "true");
                    chrome.runtime.sendMessage({ name: "start" });
                } else if (response && response["record"] == "false" && localStorage.getItem("record") != "false") {
                    localStorage.setItem("record", "false");
                    chrome.runtime.sendMessage({ name: "stop" });
                }
            });
        }, 1000);
    }
})();
