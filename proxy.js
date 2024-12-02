const express = require("express")
const cors = require("cors")
const {createProxyMiddleware} = require('http-proxy-middleware')

const app = express()
app.use(cors())

app.use("/odata", createProxyMiddleware({
    target: "https://services.odata.org/V3/OData/OData.svc/",
    changeOrigin: true,
    pathRewrite: {
        '^/odata': ''
    }
}))

app.listen(4000,()=>{
    console.log('Proxy server running at http://localhost:4000');
})