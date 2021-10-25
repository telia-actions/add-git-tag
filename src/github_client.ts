import { context, getOctokit } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { debug } from '@actions/core';

export const createOctokitCLient = (githubToken: string): InstanceType<typeof GitHub> =>
  getOctokit(githubToken);

export const addGitTag = async (
  ref: string,
  client: InstanceType<typeof GitHub>
): Promise<void> => {
  await client.rest.git.createRef({
    owner: context.repo.owner,
    repo: context.repo.repo,
    ref,
    sha: context.sha,
  });
};

export const removeGitTag = async (
  ref: string,
  client: InstanceType<typeof GitHub>
): Promise<void> => {
  try {
    await client.rest.git.deleteRef({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref,
    });
  } catch {
    debug(`Nothing to delete: "${ref}" tag does not exist`);
  }
};
