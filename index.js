import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import { createServer } from "http";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from './routers/authRoutes.js';
import userRouter from "./routers/userRouter.js"
import roleRouter from "./routers/roleRouter.js"
import siteRouter from "./routers/siteRouter.js"
import wareHouseRouter from "./routers/wareHouseRouter.js";
import serviceRouter from "./routers/serviceRouter.js";
import { defaultUser } from "./controllers/authContoller.js";
// configure dotenv
dotenv.config();
 connectDb();
 // running default users
await defaultUser();
const app = express();
// app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRouter);
app.use("/api/roles",roleRouter );
app.use("/api/sites", siteRouter);
app.use("/api/warehouses",wareHouseRouter);
app.use("/api/services",serviceRouter)
app.use("/test",async(req,res)=>{
    res.send("Ok");
});
const httpServer = createServer(app);
const port = process.env.PORT || 5001

httpServer.listen(port,"0.0.0.0", ()=>{
    console.log(`connection successful server is listening on ${port}`);
})