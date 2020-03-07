import { JiraClient } from "./jira";
import {
  HandleChangesRequestedParams,
  HandleMergedParams,
  HandleReviewRequestedParams
} from "./interfaces";

const handleChangesRequested = async ({
  jiraTokenEncoded,
  jiraEndpoint,
  jiraIssueId,
  columnToMoveToWhenChangesRequested
}: HandleChangesRequestedParams) => {
  const jira = new JiraClient(jiraTokenEncoded);
  const availableTransitions = await jira.request(
    `${jiraEndpoint}/rest/api/3/issue/${jiraIssueId}/transitions`
  );
  const transitionId = availableTransitions.transitions?.find(
    (t: any) => t.to.name === columnToMoveToWhenChangesRequested
  )?.id;
  if (!transitionId) return;
  await jira.request(
    `${jiraEndpoint}/rest/api/3/issue/${jiraIssueId}/transitions`,
    "POST",
    { transition: { id: transitionId } }
  );
};

const handleReviewRequested = async ({
  jiraTokenEncoded,
  jiraEndpoint,
  columnToMoveToWhenReviewRequested,
  jiraIssueId
}: HandleReviewRequestedParams) => {
  const jira = new JiraClient(jiraTokenEncoded);
  const availableTransitions = await jira.request(
    `${jiraEndpoint}/rest/api/3/issue/${jiraIssueId}/transitions`
  );
  const transitionId = availableTransitions.transitions?.find(
    (t: any) => t.to.name === columnToMoveToWhenReviewRequested
  )?.id;
  if (!transitionId) return;
  await jira.request(
    `${jiraEndpoint}/rest/api/3/issue/${jiraIssueId}/transitions`,
    "POST",
    { transition: { id: transitionId } }
  );
};

const handlePullRequestMerged = async ({
  jiraTokenEncoded,
  jiraEndpoint,
  jiraIssueId,
  columnToMoveToWhenMerged
}: HandleMergedParams) => {
  const jira = new JiraClient(jiraTokenEncoded);
  const availableTransitions = await jira.request(
    `${jiraEndpoint}/rest/api/3/issue/${jiraIssueId}/transitions`
  );
  const transitionId = availableTransitions.transitions?.find(
    (t: any) => t.to.name === columnToMoveToWhenMerged
  )?.id;
  if (!transitionId) return;
  await jira.request(
    `${jiraEndpoint}/rest/api/3/issue/${jiraIssueId}/transitions`,
    "POST",
    { transition: { id: transitionId } }
  );
};

export {
  handleReviewRequested,
  handleChangesRequested,
  handlePullRequestMerged
};
