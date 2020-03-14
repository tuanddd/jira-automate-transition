import { config } from "dotenv";
config();
import { handleTransitionIssue } from "../handlers";
import { JiraClient } from "../jira";

const {
  JIRA_API_ENDPOINT,
  JIRA_ISSUE_KEY,
  JIRA_AUTH_TOKEN,
  JIRA_ACCOUNT,
  JIRA_REVIEW_ID,
  JIRA_IN_PROGRESS_ID
} = process.env;

const jiraToken = Buffer.from(`${JIRA_ACCOUNT}:${JIRA_AUTH_TOKEN}`).toString(
  "base64"
);

(async () => {
  try {
    // Your code here
  } catch (error) {
    console.error(error);
  }
})();
