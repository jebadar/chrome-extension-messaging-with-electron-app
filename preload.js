const { ipcRenderer } = require('electron');
// const ioHook = window.require('iohook'); 
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
    var btn = document.getElementById("capture");
    btn.onclick = async () => {
        ipcRenderer.send('capture-screen');
        if(btn.innerText.indexOf("Start") > -1)
        btn.innerText = "Stop";
        else 
        btn.innerText = "Start Record";
    }
    async function extractFramesFromVideo(videoBlob, fps=25) {
        return new Promise(async (resolve) => {
      
          // fully download it first (no buffering):
          let videoObjectUrl = URL.createObjectURL(videoBlob);
          let video = document.createElement("video");
      
          let seekResolve;
          video.addEventListener('seeked', async function() {
            if(seekResolve) seekResolve();
          });
      
          video.addEventListener('loadeddata', async function() {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            let [w, h] = [video.videoWidth, video.videoHeight]
            canvas.width =  w;
            canvas.height = h;
      
            let frames = [];
            let interval = 1 / fps;
            let currentTime = 0;
            let duration = video.duration;
      
            while(currentTime < duration) {
            duration = video.duration;
              video.currentTime = currentTime;
              await new Promise(r => seekResolve=r);
      
              context.drawImage(video, 0, 0, w, h);
              let base64ImageData = canvas.toDataURL();
              frames.push(base64ImageData);
      
              currentTime += interval;
            }
            resolve(frames);
          });
      
          // set video src *after* listening to events in case it loads so fast
          // that the events occur before we were listening.
          video.src = videoObjectUrl; 
      
        });
      }
    async function convertpngURL(videoChunk) {
         let frames = await extractFramesFromVideo(videoChunk)
        ipcRenderer.send("save-images", frames)
        return
    }
    function handleStream(stream) {
        // Create a MediaRecorder
        let recordedChunks = [];
        mediaRecorder = new MediaRecorder(stream);

        // Listen for data available event
        mediaRecorder.ondataavailable = function (event) {
            recordedChunks.push(event.data);
            console.log("chunks", recordedChunks)
            const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
            convertpngURL(recordedBlob);
            return;
        };

        // Start recording
        mediaRecorder.start();

        setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                // Stop recording
                mediaRecorder.stop();
                
                // Log when recording stops
                console.log('Recording stopped...');
              }
        }, 500)
    }

    function handleError(e) {
        console.log(e)
    }
    // Listen for the reply from main process
    ipcRenderer.on('screenshot-captured', async (event, sourceId) => {
        console.log(sourceId)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sourceId,
                        minWidth: 1280,
                        maxWidth: 1280,
                        minHeight: 720,
                        maxHeight: 720
                    }
                }
            })
            handleStream(stream)
        } catch (e) {
            handleError(e)
        }
        // const stream = await navigator.mediaDevices.getUserMedia({
        //     audio: false,
        //     video: {
        //         mandatory: {
        //             chromeMediaSource: 'desktop',
        //             chromeMediaSourceId: sources[0].id,
        //             minWidth: 1280,
        //             maxWidth: 1920,
        //             minHeight: 720,
        //             maxHeight: 1080
        //         }
        //     }
        // });

        // const mediaRecorder = new MediaRecorder(stream);
        // const chunks = [];

        // mediaRecorder.ondataavailable = event => {
        //     chunks.push(event.data);
        // };

        // mediaRecorder.onstop = () => {
        //     const blob = new Blob(chunks, { type: 'video/webm' });
        //     const reader = new FileReader();
        //     reader.onload = () => {
        //         const imageDataURL = reader.result;
        //         console.log(imageDataURL)
        //     };
        //     reader.readAsDataURL(blob);
        // };

        // mediaRecorder.start();
        // setTimeout(() => {
        //     mediaRecorder.stop();
        // }, 1000); // adjust the duration as needed

    })
    // Listen ioHook events from main process
    ipcRenderer.on('mousemove', function (event,store) {
        document.getElementById("move").innerText = JSON.stringify(store);
    });
    ipcRenderer.on('recordStop', function (event,store) {
        document.getElementById("capture").innerText = "Start record";
    });
    ipcRenderer.on('url', function (event, store) {
        var p = document.createElement("p");
        p.innerText = store;
        document.getElementById("urls").appendChild(p);
    });

    ipcRenderer.on('mouseclick', function (event,store) {
        document.getElementById("click").innerText = JSON.stringify(store);
    });
})