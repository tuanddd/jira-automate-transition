import * as core from "@actions/core";
import { parse } from "yaml";
import { readFileSync } from "fs";
import { ParsedResult, JiraConfig, JiraConfigFile } from "./interfaces";

const configPath = `${process.env.HOME}/jira/config.yml`;

const getArgs: () => ParsedResult | void = () => {
  let jiraConfig: Partial<JiraConfig> = {};
  jiraConfig.jiraIssueId = core.getInput("jira-issue-id");
  try {
    jiraConfig.jiraAccount = core.getInput("jira-account");
    jiraConfig.jiraEndpoint = core.getInput("jira-endpoint");
    jiraConfig.jiraToken = core.getInput("jira-token");

    const { jiraAccount, jiraEndpoint, jiraIssueId, jiraToken } = jiraConfig;

    if (!jiraIssueId || jiraIssueId === "") {
      return {
        exit: true,
        success: false,
        message: "Jira issue id not found, exiting...",
        parsedInput: undefined
      };
    }

    Array.from([jiraAccount, jiraEndpoint, jiraIssueId, jiraToken]).forEach(
      value => {
        if (value === "" || !value) throw new Error("");
      }
    );
  } catch (error) {
    console.log(`Missing input, using config file instead...`);
    const {
      JIRA_API_TOKEN,
      JIRA_BASE_URL,
      JIRA_USER_EMAIL
    }: JiraConfigFile = parse(readFileSync(configPath, "utf8"));
    jiraConfig.jiraAccount = JIRA_USER_EMAIL;
    jiraConfig.jiraEndpoint = JIRA_BASE_URL;
    jiraConfig.jiraToken = JIRA_API_TOKEN;
  }

  const githubToken = core.getInput("github-token", { required: true });
  const colReviewRequested = core.getInput(
    "column-to-move-to-when-review-requested",
    { required: true }
  );
  const colChangesRequested = core.getInput(
    "column-to-move-to-when-changes-requested",
    { required: true }
  );
  const colMerged = core.getInput("column-to-move-to-when-merged");

  const { jiraAccount, jiraEndpoint, jiraToken, jiraIssueId } = jiraConfig;

  const jiraProject = jiraIssueId!.split(/-/g)[0];
  const jiraIssueNumber = Number(jiraIssueId!.split(/-/g)[1]);

  return {
    success: true,
    exit: false,
    parsedInput: {
      githubToken,
      columnToMoveToWhenChangesRequested: colChangesRequested,
      columnToMoveToWhenReviewRequested: colReviewRequested,
      columnToMoveToWhenMerged: colMerged,
      jiraAccount,
      jiraEndpoint,
      jiraIssueId,
      jiraToken,
      jiraProject,
      jiraIssueNumber,
      jiraTokenEncoded: Buffer.from(`${jiraAccount}:${jiraToken}`).toString(
        "base64"
      )
    }
  };
};

export { getArgs };
