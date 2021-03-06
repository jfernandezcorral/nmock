const sv = require('./lib/service')
const LOCAL_PORT  = 3000

const server = sv.server([
        {path: '/api', host:"iob.ms.epd.bankia.int", port: 41180},
        {path: '/tabit', host:"tabit-epd.cm.es", port: 80, pathr: "/api/1.0/sap"},
        {path: '/tas', host:"tasap-epd.ms.bankia.int", port: 8080, pathr: "", rewrite: {"^/tas" : ""}},
    ]
)
server.listen(LOCAL_PORT)
console.log("Aceptando conexiones en puerto: " + LOCAL_PORT)
