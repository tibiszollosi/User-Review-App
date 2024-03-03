require('./index');
console.log('Starting server...');



/*
console.log("Starting server...")

import express from "express"
import cors from "cors"
import user from "./api/userreview.route.js"

const app = express();

app.use(cors()) 
app.use(express.json())

app.use("/api/v1/users", user)

app.use("*", (req, res) => 
    res.status(404).json({error: "not found"}))

export default app
*/