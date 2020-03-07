export interface JiraConfig {
  jiraEndpoint: string;
  jiraAccount: string;
  jiraToken: string;
  jiraIssueId: string;
  jiraTokenEncoded: string;
}

interface _Params {
  githubToken: string;
  columnToMoveToWhenReviewRequested: string;
  columnToMoveToWhenChangesRequested: string;
  columnToMoveToWhenMerged?: string;
}

interface AdditionalJiraConfig {
  jiraProject: string;
  jiraIssueNumber: number;
}

export interface JiraConfigFile {
  JIRA_BASE_URL: string;
  JIRA_USER_EMAIL: string;
  JIRA_API_TOKEN: string;
}

type Params = _Params & JiraConfig;
export type ParsedInput = Params & AdditionalJiraConfig;
type HandlerParams = Pick<
  ParsedInput,
  "jiraTokenEncoded" | "jiraEndpoint" | "jiraIssueId"
>;
export type HandleChangesRequestedParams = HandlerParams &
  Pick<_Params, "columnToMoveToWhenChangesRequested">;
export type HandleReviewRequestedParams = HandlerParams &
  Pick<_Params, "columnToMoveToWhenReviewRequested">;
export type HandleMergedParams = HandlerParams &
  Pick<_Params, "columnToMoveToWhenMerged">;
