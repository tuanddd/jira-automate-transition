# jira-automate-transition

This action can move Jira issue to col of choice by event (e.g: move to IN REVIEW col when author requests review, move to IN PROGRESS if reviewer requests changes, move to QA if pr is merged).

# Inputs

- `github-token`

  - **Required**
  - Usually it can be found at `${{ secrets.GITHUB_TOKEN }}`, see [this link](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) for more info

- `column-to-move-to-when-review-requested`
  - **Required**
  - Case-sensitive, status of an issue
  - If issue can not be moved or the status is not found, simply do nothing
- `column-to-move-to-when-changes-requested`
  - **Required**
  - Case-sensitive, status of an issue
  - If issue can not be moved or the status is not found, simply do nothing
- `column-to-move-to-when-merged`
  - _Optional_
  - Case-sensitive, status of an issue
  - If issue can not be moved or the status is not found or not provided, simply do nothing
- `jira-endpoint`:
  - _Optional_
  - See [Jira Rest API docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/#version)
- `jira-account`:
  - _Optional_
  - See [Using Jira API with Basic header scheme](https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/)
- `jira-token`:
  - _Optional_
  - See [Using Jira API with Basic header scheme](https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/)
- `jira-issue-id`:
  - _Optional_
  - Case-sensitive
  - Issue key, e.g: `FOO-432`, `UMA-501`, ...

# Important

Although all `jira-*` inputs are optional, they must be provided explicitly unless you are using [`@atlassian/gajira-login`](https://github.com/atlassian/gajira-login)

# Example

```yml
# Use this and you won't have to provide jira-* down there
- uses: atlassian/gajira-login@master
  env:
    JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
    JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
    JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}


  ...
- uses: tuanddd/jira-automate-transition@v1.0.0
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    column-to-move-to-when-review-requested: In Review
    column-to-move-to-when-changes-requested: In Progress
    column-to-move-to-when-merged: QA
    # Below is optional if use `atlassian/gajira-login`
    jira-endpoint: https://...
    jira-account: example@mail.com
    jira-token: ******
    jira-issue-id: FOO-312
```
