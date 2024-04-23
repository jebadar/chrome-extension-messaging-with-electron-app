const { app, BrowserWindow, ipcMain, desktopCapturer} = require('electron');
const fs = require('fs');
const net = require("net");
const Store = require('electron-store');

const path = require('node:path');

const store = new Store();
store.set("record", "false");

function messageHandler(msg, push, done) {
    if(msg["msg"] == "record") {
        // Just echo the message:
        push({"record": store.get("record")});
        done();
    } else if (msg["msg"] == "recordStop") {
        store.set("record", "false");
        mainWin.webContents.send('recordStop', null);
        push({ "record": store.get("record") });
        done();
    } else if(msg["msg"] == "url") {
        mainWin.webContents.send('url', msg["url"]);
        push({ "url": "true" });
        done();
    } else {
        console.log("here", msg)
        push(msg);
        done();
    }
}

net.createServer(function (client) {

    var nativeMessage = require('./nativeMessage');
    var input = new nativeMessage.Input();
    var transform = new nativeMessage.Transform(messageHandler);
    var output = new nativeMessage.Output();
    client.pipe(input).pipe(transform).pipe(output).pipe(client);

}).listen(3000);

// Add iohook functionality to main electron process
// const ioHook = require('iohook');

// ioHook.on('mousemove', event => {
//   //console.log(event); // { type: 'mousemove', x: 700, y: 400 }
// //   mainWindow.webContents.send('mousemove', event);
// });

// ioHook.on('mouseclick', event => {
//   mainWindow.webContents.send('mouseclick', event);
// });

// // Register and start hook
// ioHook.start();


let mainWin;
const createWindow = () => {
    mainWin = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWin.loadFile('index.html');
    // Get cursor position
    mainWin.webContents.on('did-finish-load', () => {
        mainWin.webContents.on('mousemove', (event, { x, y }) => {
            console.log('Mouse cursor position:', x, y)
        })
    })
}
app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
    // const ret = globalShortcut.register('MouseUp', () => {
    //     console.log('MouseUp is pressed')
    //   })

    //   if (!ret) {
    //     console.log('registration failed')
    //   }

    //   // Check whether a shortcut is registered.
    //   console.log(globalShortcut.isRegistered('MouseUp'))
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// Define IPC handler to capture screen
ipcMain.on('capture-screen', async (event) => {
    if (store.get("record") == "true")
        store.set("record", "false")
    else
        store.set("record", "true")

    // mainWin.minimize();

    // desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
    //     for (const source of sources) {
    //         event.reply('screenshot-captured', source.id);
    //     }
    //   })
    // // await wait()

    // setTimeout(async () => {
    //     mainWin.restore();
    // },800);
})
ipcMain.on('save-images', async (event, data) => {
    data.forEach((image,i) => {
        if(i > 0) return;
        // Extracting the base64 image data (excluding the data URI prefix)
        const base64Image = image.split(';base64,').pop();

        // Writing the base64 image data to a file
        const filePath = `screenshot${i}.png`;
        fs.writeFileSync(filePath, base64Image, { encoding: 'base64' });
    })
})
