import { parse, join } from "path";
import { createWriteStream } from "fs";
import { APP_URL } from "../../config/";
import { ApolloError } from "apollo-server-express";
export default {
  Query: {
    info: (_, {}, ctx) => "Hi from Image",
  },
  Mutation: {
    imageUploader: async (parent, { file }, ctx) => {
      try {
        const { filename, createReadStream } = await file;

        let stream = createReadStream();

        let { ext, name } = parse(filename);

        name = name.replace(/([^a-z0-9 ]+)/gi, "-").replace(" ", "_");

        let serverFile = join(
          __dirname,
          `../../uploads/${name}-${Date.now()}${ext}`
        );

        serverFile = serverFile.replace(" ", "_");

        let writeStream = await createWriteStream(serverFile);

        await stream.pipe(writeStream);

        serverFile = `${APP_URL}${serverFile.split("uploads")[1]}`;

        return serverFile;
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
  },
};
