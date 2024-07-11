import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { MongodbLevel } from "mongodb-level";

import { MyGitlabProvider } from "./git-provider";
import { branch, isLocal } from "./config";

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      // ...
      gitProvider: new MyGitlabProvider(),
      databaseAdapter: new MongodbLevel<string, Record<string, any>>({
        // If you are not using branches you could pass a static collection name. ie: "tinacms"
        collectionName: `tinacms-${branch}`,
        dbName: "tinacms",
        mongoUri: process.env.MONGODB_URI as string,
      }),
    });
