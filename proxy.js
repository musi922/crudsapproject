const express = require("express")
const cors = require("cors")
const {createProxyMiddleware} = require('http-proxy-middleware')

const app = express()
app.use(cors())

app.use("/odata", createProxyMiddleware({
    target:"https://services.odata.org/V2/(S(jfehxtrowbqxp0n015il4d0r))/OData/OData.svc/",
    changeOrigin:true,
}))

app.listen(5000,()=>{
    console.log('Proxy server running at http://localhost:5000');
})