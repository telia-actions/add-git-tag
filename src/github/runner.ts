import { addGitTag, createOctokitClient, removeGitTag } from '@src/github/client';
import { getGitCompatibleTimestamp, getGitInputs, getTagRef } from '@src/utils';
import { githubSetFailed } from '@src/github/actions';

export const run = async (): Promise<void> => {
  try {
    const inputs = ['tag-name', 'should-tag-with-timestamp', 'github-token'];
    const [tagName, shouldTagWithTimestamp, githubToken] = getGitInputs(inputs);
    const ref = getTagRef(tagName);
    const client = createOctokitClient(githubToken);
    await removeGitTag(ref, client);
    await addGitTag(ref, client);
    if (shouldTagWithTimestamp === 'true') {
      await addGitTag(`${ref}${getGitCompatibleTimestamp()}`, client);
    }
  } catch (error: any) {
    githubSetFailed(error.message);
  }
};
