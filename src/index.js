const express = require("express");
const app = express();
const routeuser = require("./routes/user");
const routeauth = require("./routes/auth");
const routedonatur = require("./routes/donatur");
const routepenerima = require("./routes/penerima");
const routeoption = require("./routes/options");
const routedonasi = require("./routes/donasi");
const routeslider = require("./routes/slider");
const routecontent = require("./routes/content");
const routecategory = require("./routes/postcategory");
const routepost = require("./routes/post");
const routeapi  = require("./routes/api");

const path = require('path');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS',
      );
    console.log(`${new Date().toString()} => ${req.originalUrl}`);
    next();
  });
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.sendFile(path.join(__dirname, '../public/500.html'));
})

app.use("/user", routeuser);
app.use("/auth", routeauth);
app.use("/donatur", routedonatur);
app.use("/penerima", routepenerima);
app.use("/option", routeoption);
app.use("/donasi", routedonasi);
app.use("/slider", routeslider);
app.use("/content", routecontent);
app.use("/category", routecategory);
app.use("/post", routepost);
app.use("/api", routeapi);
app.use(express.static("public"))
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.info(`server runing on port ${PORT}`));