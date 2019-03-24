const sv = require('./lib/service')
const LOCAL_PORT  = 3000

const server = sv.server(LOCAL_PORT,
    [
        {path: '/api', host:"iob.ms.epd.bankia.int", port: 41180},
        {path: '/tabit', host:"tabit-epd.cm.es", port: 80, pathr: "/api/1.0/sap"},
    ]
)
