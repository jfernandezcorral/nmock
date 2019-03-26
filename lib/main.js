const {app, BrowserWindow, dialog} = require ('electron')
const sv = require('./service')
const LOCAL_PORT  = 3000


/*const fs = require('fs')
const getFileFromUser = exports.getFileFromUser = () =>{
    dialog.showOpenDialog(
        mainW,
        {
            properties: ['openFile'],
            filters: [{name: 'Markdown Files', extensions: ['md', 'markdown']}]
        },
        (files)=>{
            const content = files? fs.readFileSync(files[0]).toString(): undefined
            content && mainW.webContents.send('file-opened', files[0], content)
        }
    )
}*/
let server = undefined
const changeMock = exports.changeMock = (bool)=>{
    if (!server || !server.listening){
        mainW.webContents.send('stopped')
        return
    }
    sv.changeMock(bool)
    //server.close()
}
const paraServer = exports.paraServer = ()=>{
    if (!server || !server.listening){
        mainW.webContents.send('stopped')
        return
    }
    server.close()
}
const iniciaServer = exports.iniciaServer = ()=>{
    if (server && server.listening){
        mainW.webContents.send('running')
        return
    }
    server = sv.server([
            {path: '/api', host:"iob.ms.epd.bankia.int", port: 41180},
            {path: '/tabit', host:"tabit-epd.cm.es", port: 80, pathr: "/api/1.0/sap"},
            {path: '/tas', host:"tasap-epd.ms.bankia.int", port: 8080, pathr: "", rewrite: {"^/tas" : ""}},
        ]
    )
    server.on('listening',()=>{
        mainW.webContents.send('serverInit')
        console.log("Aceptando conexiones en puerto: " + 3000)
    })
    server.on('close',()=>{
        mainW.webContents.send('serverStop')
        console.log("Servidor detenido")
    })
    server.listen(3000)
}
let mainW = null
app.on('ready', ()=>{
    mainW = new BrowserWindow({show: false, /*frame: false, transparent: true*/})
    mainW.loadFile('./lib/build/index.html')
    mainW.once('ready-to-show', () => {
        mainW.show();
        //getFileFromUser();
    });
    mainW.on('closed',()=>{
        mainW = null
    })
})