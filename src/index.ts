import * as core from "@actions/core";
import { getArgs } from "./get-args";
import { ParsedResult } from "./interfaces";
import * as github from "@actions/github";
import { Github } from "./github";
import { handleTransitionIssue } from "./handlers";
import * as Webhooks from "@octokit/webhooks";

async function run() {
  try {
    const { parsedInput, success, exit, message } = getArgs() as ParsedResult;
    if (!parsedInput && !success && exit && message) {
      core.warning(message);
    } else if (!parsedInput) {
      throw new Error("Error trying to parse input.");
    } else {
      const context = github.context;
      const {
        repo: { owner, repo },
        payload: { action },
        eventName
      } = context;
      if (eventName === "pull_request" && action === "review_requested") {
        core.info(
          `Changing issue ${parsedInput.jiraIssueId} to ${parsedInput.columnToMoveToWhenReviewRequested}`
        );
        await handleTransitionIssue({
          ...parsedInput,
          colName: parsedInput.columnToMoveToWhenReviewRequested
        });
      } else if (
        eventName === "pull_request_review" &&
        action === "submitted"
      ) {
        const {
          pull_request: { number },
          review: { id }
        } = context.payload as Webhooks.WebhookPayloadPullRequestReview;
        const { githubToken } = parsedInput;
        const githubWrapper = new Github(githubToken, owner, repo);
        const isRequestChange = await githubWrapper.checkReviewIsRequestChange({
          pull_number: number,
          review_id: id
        });
        if (isRequestChange) {
          core.info(
            `Changing issue ${parsedInput.jiraIssueId} to ${parsedInput.columnToMoveToWhenChangesRequested}`
          );
          await handleTransitionIssue({
            ...parsedInput,
            colName: parsedInput.columnToMoveToWhenChangesRequested
          });
        }
      } else if (eventName === "pull_request" && action === "closed") {
        const {
          merged
        } = (context.payload as Webhooks.WebhookPayloadPullRequest).pull_request;
        if (merged && parsedInput.columnToMoveToWhenMerged) {
          core.info(
            `Changing issue ${parsedInput.jiraIssueId} to ${parsedInput.columnToMoveToWhenMerged}`
          );
          await handleTransitionIssue({
            ...parsedInput,
            colName: parsedInput.columnToMoveToWhenMerged
          });
        }
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
