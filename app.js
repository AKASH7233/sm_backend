import express from 'express'
import cors from 'cors'
import  cookieParser from 'cookie-parser'
import { verifyJWT } from './src/middlewares/auth.js'

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())


//Route Setup
import router from './src/routes/user.route.js'
import postrouter from './src/routes/post.route.js'

app.use('/api/v1/user', router)
app.use('/api/v1/post', postrouter)
//http://localhost:8000/api/v1/user/register

export {app}