import express from "express"
import type {Request, Response} from "express"
const app = express()
const port = 2228


app.get('/', (req:Request, res: Response) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example appdddd listening on port ${port}`)
})