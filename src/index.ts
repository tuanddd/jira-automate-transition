import * as core from "@actions/core";
import { getArgs } from "./get-args";
import { ParsedInput } from "./interfaces";
import * as github from "@actions/github";
import {
  handleReviewRequested,
  handleChangesRequested,
  handlePullRequestMerged
} from "./handlers";
import * as Webhooks from "@octokit/webhooks";

async function run() {
  try {
    const parsedInput = getArgs() as ParsedInput;
    const context = github.context;
    const {
      payload: { action },
      eventName
    } = context;
    if (eventName === "pull_request" && action === "review_requested") {
      core.info(
        `Changing issue ${parsedInput.jiraIssueId} to ${parsedInput.columnToMoveToWhenReviewRequested}`
      );
      handleReviewRequested(parsedInput);
    } else if (eventName === "pull_request_review" && action === "submitted") {
      core.info(
        `Changing issue ${parsedInput.jiraIssueId} to ${parsedInput.columnToMoveToWhenChangesRequested}`
      );
      handleChangesRequested(parsedInput);
    } else if (eventName === "pull_request" && action === "closed") {
      const {
        merged
      } = (context.payload as Webhooks.WebhookPayloadPullRequest).pull_request;
      if (merged) {
        core.info(
          `Changing issue ${parsedInput.jiraIssueId} to ${parsedInput.columnToMoveToWhenMerged}`
        );
        handlePullRequestMerged(parsedInput);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
