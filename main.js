import express from "express"
import {} from "dotenv/config"
import FastPassModel from "./models/PostgresModel.js"
import router_auth from "./routes/auth.js"
import router_user from "./routes/users.js"

const app = express();

// Define a port number
const port = process.env.PORT || 3001;


const postgresModel = new FastPassModel();

//app.use(express.urlencoded({extended: false}))
app.use(express.json());

app.use("/", await router_auth(postgresModel));
app.use("/users", await router_user(postgresModel));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
