const express = require('express');
const cors = require('cors'); //frontend és backend közötti kommunikációhoz
const userController = require('./userController'); //usereket kezelő kontroller
const authMiddleware = require('./authMiddleware'); //megnézi, hogy a user már bejelentkezett állapotban van-e mielőtt az hozzáférést kap a különböző útvonalakhoz
const pool = require('./database');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/userinfo', userController);
//app.use('/api/userinfo', authMiddleware.requireLogin, userController);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running and listening on port: ${PORT}`);
});