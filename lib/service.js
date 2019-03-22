const crypto = require('crypto')
const BD = {}
const write = (s, txt)=>{
    s.removeAllListeners()
    s.end(txt)
}
exports.handle = function(msg){
    const txt = msg.toString('utf8')
    const ar = txt.split('\r\n')
    const peticion = ar[0]
    const [method, url, protocol] = peticion.split(/\s+/)
    let inicio_data = false
    const headers = []
    const data = []
    for (let i=1; i < ar.length; i++){
        if (ar[i]===""){
            inicio_data = true
        }
        else if(!inicio_data){
            headers.push(ar[i])
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
        BD[hash] = {method, url, protocol, headers, body}
        write(this, "HTTP/1.1 200 OK\r\nContent-Length: 4\r\nConnection: Closed\r\n\r\nhola")
        }
    console.log(Object.keys(BD))
    console.log("===========")
}

