import { Gitlab } from "@gitbeaker/rest";
import { Base64 } from "js-base64";
import type { GitProvider } from "@tinacms/datalayer";

import { isLocal } from "./config";

if (isLocal) console.log("Running TinaCMS in local mode.");
else console.log("Running TinaCMS in production mode.");

const host = process.env.GITLAB_HOST as string;
const projectId = process.env.GITLAB_PROJECT_ID as string;
const token = process.env.GITLAB_PERSONAL_ACCESS_TOKEN as string;
const branch = process.env.GITLAB_BRANCH as string;

const gitbeaker = new Gitlab({
  token: token,
  host: host,
});

export interface GitlabProviderOptions {
  host: string;
  repo: string;
  token: string;
  branch: string;
  commitMessage?: string;
  rootPath?: string;
}

export class MyGitlabProvider implements GitProvider {
  repo: string;
  branch: string;
  rootPath?: string;
  commitMessage?: string;

  constructor(args: GitlabProviderOptions) {
    this.repo = args.repo;
    this.branch = args.branch;
    this.commitMessage = args.commitMessage;
    this.rootPath = args.rootPath;
  }

  async onPut(key: string, value: string) {
    let fileExists = false;
    try {
      await gitbeaker.RepositoryFiles.show(projectId, key, branch);
      fileExists = true;
    } catch (e) {}

    const { data } = await gitbeaker.Commits.create(
      projectId,
      branch,
      "Tina CMS Commit",
      [
        {
          filePath: key,
          action: fileExists ? "update" : "create",
          content: Base64.encode(value),
          encoding: "base64",
        },
      ]
    );
  }

  async onDelete(key: string) {
    let fileExists = false;
    try {
      await gitbeaker.RepositoryFiles.show(projectId, key, branch);
      fileExists = true;
    } catch (e) {}

    if (fileExists) {
      const { data } = await gitbeaker.Commits.create(
        projectId,
        branch,
        "Tina CMS Commit",
        [
          {
            filePath: key,
            action: "delete",
          },
        ]
      );
    }
  }
}
