var cron = require("node-cron");
const app = express();

cron.schedule("* * * * * *", () => {
  console.log("Every Minute");
  app.listen(2400, () => {
    console.log("Server started at port 2400");
  });
});
