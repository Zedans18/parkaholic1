var cron = require("node-cron");

cron.schedule("* * * * *", () => {
  console.log("Every Minute");
});
