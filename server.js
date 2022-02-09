const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBSession = require("connect-mongodb-session")(session);

const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./gqlSchema/gqlUserSchema");
const dotenv = require("dotenv").config();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
const mongoURL = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 3000;
mongoose
  .connect(mongoURL)
  .then(() => console.log("successfully connect to the database Atlas"))
  .catch((err) => console.log(`error connecting to the database Atlas ${err}`));
const store = new MongoDBSession({
  uri: mongoURL,
  collection: "graphQLSessions",
});
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
  })
);

app.use(
  "/graphql",
  new graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ success: false, message: err.message });
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
