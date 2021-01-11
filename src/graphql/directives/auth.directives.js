import { defaultFieldResolver } from "graphql";
import { ApolloError, SchemaDirectiveVisitor } from "apollo-server-express";

export class IsAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    // Getting the field that the directive is on
    const { resolve = defaultFieldResolver } = field;

    // bind context to field so we can have auth on that field
    field.resolve = async function (...args) {
      const [_, {}, ctx] = args;
      const { isAuth } = ctx;

      if (isAuth) {
        const result = await resolve.apply(this, args);
        return result;
      } else {
        throw new ApolloError("Not Authenticated");
      }
    };
  }
}
