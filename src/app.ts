import express from "express"
import type {Request, Response} from "express"
const app = express()
import router from "./routers.js"
const port = 2228


app.use(express.json())
app.use('/', router)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})