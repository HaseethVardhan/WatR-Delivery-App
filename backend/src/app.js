import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js'
import supplierRouter from './routes/supplier.routes.js'
import addressRouter from './routes/address.routes.js'
import productRouter from './routes/product.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'

const app = express()

app.use(cors({}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/user', userRouter)
app.use('/supplier', supplierRouter)
app.use('/address', addressRouter)
app.use('/product', productRouter)
app.use('/subscription', subscriptionRouter)


export { app }