import { success, error } from "consola";
import { join } from "path";
import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
// import bodyParser from "body-parser";
import * as AppModels from "./models";

// env
import { PORT, IN_PROD, DATABASE_URL } from "./config";

// TypeDefs & Resolver Functions
import { typeDefs, resolvers } from "./graphql";

import { schemaDirectives } from "./graphql/directives";
import { AuthMiddleware } from "./middlewares/auth";

// Initial the express app
const app = express();

app.use(AuthMiddleware);
app.use(express.static(join(__dirname, "./uploads")));

// Apollo Server pass typeDefs, resolvers, isProd, context with Authentication
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  playground: IN_PROD,
  context: ({ req }) => {
    const { isAuth, userContext } = req;
    return {
      req,
      isAuth,
      userContext,
      ...AppModels,
    };
  },
});

const startApp = async () => {
  try {
    await mongoose.connect(
      DATABASE_URL,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      },
      success({
        badge: true,
        message: `Successfully connected to DB`,
      })
    );
    // Inject Apollo server Middleware on Express app
    server.applyMiddleware({ app });

    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: err.message,
      badge: true,
    });
  }
};

startApp();
