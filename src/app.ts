import express from "express"
const app = express()
import router from "./routers.js"
import { fakerRU } from "@faker-js/faker"
import { users } from "./utils/createUsers.js"
const port = 2228
const id = fakerRU.number.int(); // 42
console.log(id)
app.use(express.json())
app.use('/', router)


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})