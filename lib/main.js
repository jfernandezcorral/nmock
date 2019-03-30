const {app, BrowserWindow, dialog} = require ('electron')
const sv = require('./service')
const fs = require('fs')
const path = require('path')
const DEFAULT_CFG = {
    "IOB EPD": {
        port: 3000,
        reglas: [
            {path: '/api', host:"iob.ms.epd.bankia.int", port: 41180},
            {path: '/tabit', host:"tabit-epd.cm.es", port: 80, pathr: "/api/1.0/sap"},
            {path: '/tas', host:"tasap-epd.ms.bankia.int", port: 8080, pathr: "", rewrite: {"^/tas" : ""}}
        ]
    },
    "IOB EPI": {
        port: 3000,
        reglas: [
            {path: '/api', host:"iob.ms.epi.bankia.int", port: 41180},
            {path: '/tabit', host:"tabit-epi.cm.es", port: 80, pathr: "/api/1.0/sap"},
            {path: '/tas', host:"tasap-epi.ms.bankia.int", port: 8080, pathr: "", rewrite: {"^/tas" : ""}}
        ]
    }
}

const leerCfg = ()=>{//crea fichero cfg si no existe
    const ruta_destino = path.resolve(app.getPath('home'), 'nmock.json')
    return new Promise((resolve, reject)=>{
        fs.exists(ruta_destino, test=>{
            if (test){
                try{
                    const txt = fs.readFileSync(ruta_destino, {encoding: 'utf-8'})
                    resolve(JSON.parse(txt))
                }
                catch(e){
                    reject(e)
                }
            }
            else{
                try{
                    fs.writeFileSync(ruta_destino, JSON.stringify(DEFAULT_CFG, null, "\t"))
                    resolve(DEFAULT_CFG)
                }
                catch(e){
                    reject(e)
                }
            }
        })
    })
    
}
const LOCAL_PORT  = 3000
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
        mainW.webContents.send('log', '<reset/>')
        mainW.webContents.send('consola', '<reset/>')
        sv.consola("Aceptando conexiones en puerto: " + 3000)
    })
    server.on('close',()=>{
        mainW.webContents.send('serverStop')
        sv.consola("Servidor detenido")
    })
    server.on('error',(e)=>{
        sv.consola(e)
        server.close()
        mainW.webContents.send('serverStop')
        sv.consola("Servidor detenido")
    })
    server.listen(3000)
}
exports.getLog = () =>{
    return sv.getLog()
}
exports.getConsola = () =>{
    return sv.getConsola()
}
exports.getCfg = () =>{
    return JSON.stringify(CFG, null, "\t")
}
exports.salvar = txt =>{
    const ruta_destino = path.resolve(app.getPath('home'), 'nmock.json')
    const wr = JSON.stringify(JSON.parse(txt), null, "\t")
    return new Promise((resolve, reject)=>{
        fs.writeFile(ruta_destino, wr, {encoding: 'utf-8'}, e=>{
            if (e){
                reject(e)
            }
            else{
                resolve(wr)
                CFG = JSON.parse(wr)
            }
        })
    })
}
let mainW = null
let CFG = undefined
app.on('ready', ()=>{
    leerCfg().then(cfg=>{
        CFG = cfg
    })
    .catch((e)=>{
        sv.consola(e)
        CFG = DEFAULT_CFG
    })
    .finally(()=>{
        mainW = new BrowserWindow({show: false, /*frame: false, transparent: true*/})
        sv.setMainW(mainW)
        mainW.loadFile('./lib/build/index.html')
        mainW.once('ready-to-show', () => {
            mainW.show()
        });
        mainW.on('closed',()=>{
            mainW = null
        })
    })
})