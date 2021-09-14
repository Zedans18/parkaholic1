var cron = require("node-cron");
const express = require("express");
const app = express();
app.listen(2400, () => {
    console.log("Server started at port 2400");
});
cron.schedule("* * * * * *", () => {
    console.log("Every Minute");
});