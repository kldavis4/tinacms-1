import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";

import { TinaAuthJSOptions, AuthJsBackendAuthProvider } from "tinacms-authjs";

import databaseClient from "../../../../tina/__generated__/databaseClient";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const handler = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
          databaseClient: databaseClient,
          secret: process.env.NEXTAUTH_SECRET as string,
        }),
      }),
  databaseClient,
});

export default (req: any, res: any) => {
  // Modify the request here if you need to
  return handler(req, res);
};
