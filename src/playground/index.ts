import { config } from "dotenv";
config();
import { handleChangesRequested, handleReviewRequested } from "../handlers";

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
    handleReviewRequested({
      jiraTokenEncoded: jiraToken,
      jiraEndpoint: JIRA_API_ENDPOINT!,
      jiraIssueId: JIRA_ISSUE_KEY!,
      columnToMoveToWhenReviewRequested: "Review"
    });
  } catch (error) {
    console.error(error);
  }
})();
