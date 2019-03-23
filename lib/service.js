const net = require('net')
const crypto = require('crypto')
const BD = {}
const REMOTO = {host:"iob.ms.epd.bankia.int", port: 41180}
const content_length = /Content-Length:\s(\d+)$/
const close = (s, txt)=>{
    s.removeAllListeners()
    s.end(txt)
}
const resolve = cfg=>{
    return new Promise((resolve, reject)=>{
        const payload = `${cfg.peticion}\r\n${cfg.headers.join('\r\n')}\r\n\r\n${cfg.body}`
        //console.log(payload)
        const serviceSocket = new net.Socket()
        serviceSocket.connect(REMOTO.port, REMOTO.host, ()=> {
            serviceSocket.write(payload)
        })
        let length = -1
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
            else if (Buffer.byteLength(body.join(''), 'utf-8') - length == 0){
                close(serviceSocket, undefined)
                //console.log('sdfsdf@@@@@@@@@@@@@@@@@@')
                resolve(buf)
            }
        })
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
        close(this,BD[hash].buf)
        console.log("#" + BD[hash].peticion)
    }
    else{
        BD[hash] = {peticion, method, url, protocol, headers, body}
        resolve(BD[hash]).then(buf=>{
            BD[hash].buf = buf
            console.log("+" + BD[hash].peticion)
            close(this, buf)
        })
    }
}

