const net = require('net')
const crypto = require('crypto')
const BD = {}
const REMOTO = {host:"www.google.com", port: 80}
const content_length = /Content-Length:\s(\d+)$/
const write = (s, txt)=>{
    s.removeAllListeners()
    s.end(txt)
}
const resolve = cfg=>{
    const payload = `${cfg.peticion}\r\n${cfg.headers.join('\r\n')}\r\n\r\n${cfg.body}`
    console.log(payload)
    const serviceSocket = new net.Socket()
    serviceSocket.connect(REMOTO.port, REMOTO.host, ()=> {
        serviceSocket.write(payload)
    })
    let length = 0
    let inicio_data = false
    let body = ""
    let offset_data = 0
    serviceSocket.on("data", function (data) {
        const data0 = data.toString()
        body += data0
        if (!inicio_data){//primer chunk
            data0.split('\r\n').forEach(lin=>{
                if (!inicio_data){
                    if(content_length.test(lin)){
                        length = lin.match(content_length)[1]
                    }
                    else if(!inicio_data && lin==''){
                        inicio_data = true
                        offset_data = body.indexOf("\r\n\r\n") + 4
                    }
                }
            })
        }
        if (body.length == offset_data + length){
            console.log('sdfsdf')
        }
        console.log(body.length)
        console.log(offset_data, length)
        console.log("===========")
        //console.log(body)
        /*console.log(data0)
        console.log(length)
        serviceSocket.removeAllListeners()
        serviceSocket.end()*/
    })
}
exports.handle = function(msg){
    const txt = msg.toString('utf8')
    const ar = txt.split('\r\n')
    const peticion = ar[0]
    const [method, url, protocol] = peticion.split(/\s+/)
    let inicio_data = false
    const headers = [`Host: ${REMOTO.host}:${String(REMOTO.port)}`]
    const data = []
    for (let i=1; i < ar.length; i++){
        if (ar[i]===""){
            inicio_data = true
        }
        else if(!inicio_data){
            ar[i].indexOf('Host:')!=0 && headers.push(ar[i])
        }
        else{
            data.push(ar[i])
        }
    }
    const body = data.join('\r\n')
    const hash = crypto.createHash('md5').update(peticion + body).digest("hex")
    if (BD[hash]){
        write(this, "HTTP/1.1 200 OK\r\nContent-Length: 4\r\nConnection: Closed\r\n\r\nhola")
    }
    else{
        BD[hash] = {peticion, method, url, protocol, headers, body}
        resolve(BD[hash])
        write(this, "HTTP/1.1 200 OK\r\nContent-Length: 4\r\nConnection: Closed\r\n\r\nhola")
    }
    //console.log(Object.keys(BD))
    //console.log("===========")
}

