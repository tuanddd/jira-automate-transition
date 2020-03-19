import { JiraClient } from "./jira";
import { HandleTransitionParams } from "./interfaces";
import { warning, info } from "@actions/core";

const transitionIssue = async ({
  jiraTokenEncoded,
  jiraEndpoint,
  jiraIssueId,
  colName
}: HandleTransitionParams) => {
  const jira = new JiraClient(jiraTokenEncoded);

  const issueDetail = await jira.request(
    `${jiraEndpoint}/rest/api/3/issue/${jiraIssueId}`
  );
  const {
    fields: {
      status: { name }
    }
  } = issueDetail;
  if (name === colName) {
    warning(`
        The issue ${jiraIssueId} is already in status ${colName}.
        Action will exit without doing anything.  
      `);
  } else {
    const availableTransitions = await jira.request(
      `${jiraEndpoint}/rest/api/3/issue/${jiraIssueId}/transitions`
    );
    const transitionId = availableTransitions.transitions?.find(
      (t: any) => t.to.name === colName
    )?.id;
    if (!transitionId)
      throw new Error(`
      There was an error trying to transition issue ${jiraIssueId}:
      Transition to status "${colName}" cannot be found.
      Check all of the transitions' rules, conditions of yourr project's workflow.
      See more: https://confluence.atlassian.com/adminjiraserver073/working-with-workflows-861253510.html
    `);
    info(`Changing issue ${jiraIssueId} to ${colName}`);
    await jira.request(
      `${jiraEndpoint}/rest/api/3/issue/${jiraIssueId}/transitions`,
      "POST",
      { transition: { id: transitionId } }
    );
  }
};

const handleTransitionIssue = async ({
  resolveTicketIdsFunc,
  branchName,
  ...rest
}: HandleTransitionParams) => {
  if (resolveTicketIdsFunc && branchName) {
    const result = await resolveTicketIdsFunc(branchName);
    if (Array.isArray(result)) {
      result.forEach(ticketId => {
        transitionIssue({ ...rest, jiraIssueId: ticketId });
      });
    } else if (typeof result === "string") {
      transitionIssue({ ...rest, jiraIssueId: result });
    } else {
      transitionIssue({ ...rest });
    }
  } else {
    transitionIssue({ ...rest });
  }
};

export { handleTransitionIssue };
