import { context, getOctokit } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { githubDebug } from '@src/github/actions';

export const createOctokitClient = (githubToken: string): InstanceType<typeof GitHub> =>
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
    githubDebug(`Failed to delete "${ref}" tag`);
  }
};
