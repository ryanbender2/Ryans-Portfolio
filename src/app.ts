import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import path from "path";

// import session from "express-session";
// import MongoStore from "connect-mongo";
// import flash from "express-flash";
// import mongoose from "mongoose";
// import bluebird from "bluebird";
// import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as apiController from "./controllers/api";

// Create Express server
const app = express();

// Connect to MongoDB
// const mongoUrl = MONGODB_URI;
// mongoose.Promise = bluebird;

// mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
//     () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
// ).catch(err => {
//     console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
//     // process.exit();
// });

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({
//     resave: true,
//     saveUninitialized: true,
//     secret: SESSION_SECRET,
//     store: new MongoStore({
//         mongoUrl,
//         mongoOptions: {
//             autoReconnect: true
//         }
//     })
// }));
// app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * Primary app routes.
 */
app.get("/", homeController.index);

/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);

export default app;
