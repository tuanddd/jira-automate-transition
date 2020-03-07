import * as github from "@actions/github";

export class Github {
  private octokit: github.GitHub;
  constructor(
    private token: string,
    private owner: string,
    private repo: string
  ) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
    this.octokit = new github.GitHub(token);
  }

  checkReviewIsRequestChange: ({
    pull_number,
    review_id
  }: {
    pull_number: number;
    review_id: number;
  }) => Promise<boolean> = async ({ pull_number, review_id }) => {
    const res = await this.octokit.pulls.getReview({
      owner: this.owner,
      repo: this.repo,
      pull_number,
      review_id
    });
    return res.data.state === "CHANGES_REQUESTED";
  };
}
