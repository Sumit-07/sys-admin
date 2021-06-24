
require("dotenv").config();
const http=require('http');
const app=require('./app');
const Sequelize = require('sequelize');

const server = http.createServer(app);
server.listen(process.env.APP_PORT);