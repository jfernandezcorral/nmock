const net = require('net')
const crypto = require('crypto')
const BD = {}
const pending = new Map()
const running = new Map()
const content_length = /Content-Length:\s(\d+)$/i
const header_host = /Host:\s/i
const close = (s, txt)=>{
    s.removeAllListeners()
    s.end(txt)
}
const composepayload = (cfg, remoto)=>{
    let url = cfg.url
    remoto.rewrite && Object.entries(remoto.rewrite).forEach(([reg, rep])=>{url = url.replace(new RegExp(reg), rep)})
    url = remoto.pathr? remoto.pathr + url: url
    const peticion = `${cfg.method} ${url} ${cfg.protocol}`
    return `${peticion}\r\n${cfg.headers.join('\r\n')}\r\n\r\n${cfg.body}`
}
const resolve = cfg=>{
    return new Promise((resolve, reject)=>{
        const {remoto} = cfg
        if (!remoto){
            resolve(`HTTP/1.1 404 Not Found\r\nContent-Length: 9\r\nConnection: Closed\r\n\r\nNOT FOUND`)
            return
        }
        const payload = composepayload(cfg, remoto)
        //console.log(payload)
        const serviceSocket = new net.Socket()
        serviceSocket.connect(remoto.port, remoto.host, ()=> {
            serviceSocket.write(payload)
        })
        let length = 9999999999999999999999999
        let inicio_data = false
        let body = []
        let chunked = false
        const headers = []
        let buf = Buffer.from([])
        serviceSocket.on("error", (e)=>{
            console.error(e)
            resolve(`HTTP/1.1 500 Internal Server Error\r\nContent-Length: ${e.code.length}\r\nConnection: Closed\r\n\r\n${e.code}`)
        })
        serviceSocket.on("data", function (data) {
            //console.log('######################')
            buf = Buffer.concat([buf, data])
            const data0 = data.toString('utf-8').split('\r\n')
            data0.forEach((lin, index)=>{
                if (!inicio_data){
                    lin != "" && headers.push(lin)
                    if(content_length.test(lin)){
                        length = parseInt(lin.match(content_length)[1])
                    }
                    else if(lin.indexOf('Transfer-Encoding: chunked')==0){
                        chunked = true
                    }
                    else if(lin==''){
                        inicio_data = true
                    }
                }
                else{
                    body.push(lin + (index==data0.length-1?"": "\r\n"))
                }
            })
            if (chunked && body[body.length-1]=="" && body[body.length-2]=="\r\n" && body[body.length-3]=="0\r\n"){
                close(serviceSocket, undefined)
                //console.log('sdfsdf@@@@@@@@@@@@@@@@@@')
                resolve(buf)
            }
            else if ((Buffer.byteLength(body.join(''), 'utf-8') - length) >= 0){
                close(serviceSocket, undefined)
                //console.log('sdfsdf@@@@@@@@@@@@@@@@@@')
                resolve(buf)
            }
            //console.log('buf:', Buffer.byteLength(body.join(''), 'utf-8'))
            //console.log('length', length)
        })
    })
    
}
const continuar = (socket, st, buf)=>{
    st.body += buf.toString()
    if (Buffer.byteLength(st.body, 'utf-8') - st.length == 0){
        const hash = crypto.createHash('md5').update(st.peticion + st.body).digest("hex")
        pending.delete(socket)
        if (BD[hash]){
            if (!BD[hash].buf){
                running.set(this, hash)
                return
            }
            close(socket,BD[hash].buf)
            console.log("#" + BD[hash].peticion)
        }
        else{
            BD[hash] = {peticion: st.peticion, method: st.method, url: st.url, protocol: st.protocol, headers: st.headers, body: st.body, remoto: st.remoto}
            resolve(BD[hash]).then(buf=>{
                BD[hash].buf = buf
                completeRunning(hash)
                console.log("+" + BD[hash].peticion)
                close(socket, buf)
            })
        }
    }
}
const completeRunning = hash=>{
    const completar = []
    running.forEach((h, s)=>{
        h==hash && completar.push({s, h})
    })
    completar.forEach(it=>{
        running.delete(it.s)
        console.log("+++" + BD[it.h].peticion)
        close(it.s, BD[it.h].buf)
    })
}
const handle = exports.handle = function(msg){
    //console.log(this.rutas)
    const incompleta = pending.get(this)
    if (incompleta){
        continuar(this, incompleta, msg)
        return
    }
    const txt = msg.toString('utf8')
    const ar = txt.split('\r\n')
    const peticion = ar[0]
    const [method, url, protocol] = peticion.split(/\s+/)
    let inicio_data = false
    const data = []
    let length = 0
    const headers = []
    for (let i=1; i < ar.length; i++){
        if (!inicio_data && ar[i]===""){
            inicio_data = true
        }
        else if(content_length.test(ar[i])){
            length = parseInt(ar[i].match(content_length)[1])
            headers.push(ar[i])
        }
        else if(!inicio_data){
            !header_host.test(ar[i]) && headers.push(ar[i])
        }
        else{
            data.push(ar[i])
        }
    }
    const remoto = this.rutas.find(it=> url.indexOf(it.path) == 0)
    remoto && headers.push(`Host: ${remoto.host}:${String(remoto.port)}`)
    const body = data.join('\r\n')
    if (Buffer.byteLength(body, 'utf-8') - length < 0){
        pending.set(this, {peticion, method, url, protocol, headers, body, length, remoto})
        return
    }
    const hash = crypto.createHash('md5').update(peticion + body).digest("hex")
    if (BD[hash]){
        if (!BD[hash].buf){
            running.set(this, hash)
            return
        }
        close(this,BD[hash].buf)
        console.log("#" + BD[hash].peticion)
    }
    else{
        BD[hash] = {peticion, method, url, protocol, headers, body, remoto}
        resolve(BD[hash]).then(buf=>{
            BD[hash].buf = buf
            completeRunning(hash)
            console.log("+" + BD[hash].peticion)
            close(this, buf)
        })
    }
}
exports.server = (port, rutas) =>{
    const server = net.createServer(socket => {
        socket.rutas = server.rutas
        socket.on('data', handle.bind(socket))
    })
    server.rutas = rutas
    server.listen(port)
    console.log("Aceptando conexiones en puerto: " + port)
    return server
}
