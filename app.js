const express = require("express")
const app = express()
const router = require("./routes/index")
require("dotenv").config()
const port = process.env.PORT

app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.use(router)

app.listen(port, () => {
    console.log("server running on poort : ", port);
}) 
