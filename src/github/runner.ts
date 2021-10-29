import { addGitTag, createOctokitClient, removeGitTag } from '@src/github/client';
import { getGitCompatibleTimestamp, getGitInputs, getTag, getTagRef } from '@src/utils';
import { githubSetFailed } from '@src/github/actions';

export const run = async (): Promise<void> => {
  try {
    const inputs = ['tag-name', 'commit-sha', 'should-tag-with-timestamp', 'github-token'];
    const [tagName, commitSha, shouldTagWithTimestamp, githubToken] = getGitInputs(inputs);
    const ref = getTagRef(tagName);
    const tag = getTag(tagName);
    const client = createOctokitClient(githubToken);
    await removeGitTag(tag, client);
    await addGitTag(ref, commitSha, client);
    if (shouldTagWithTimestamp === 'true') {
      await addGitTag(`${ref}${getGitCompatibleTimestamp()}`, commitSha, client);
    }
  } catch (error: any) {
    githubSetFailed(error.message);
  }
};
