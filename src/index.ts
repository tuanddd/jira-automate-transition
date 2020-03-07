import * as core from "@actions/core";
import { getArgs } from "./get-args";
import { ParsedInput } from "./interfaces";
import * as github from "@actions/github";
import { Github } from "./github";
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
      repo: { owner, repo },
      payload: { action },
      eventName
    } = context;
    if (eventName === "pull_request" && action === "review_requested") {
      core.info(
        `Changing issue ${parsedInput.jiraIssueId} to ${parsedInput.columnToMoveToWhenReviewRequested}`
      );
      handleReviewRequested(parsedInput);
    } else if (eventName === "pull_request_review" && action === "submitted") {
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
        handleChangesRequested(parsedInput);
      }
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
