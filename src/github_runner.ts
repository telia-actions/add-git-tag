import { addGitTag, createOctokitCLient, removeGitTag } from './github_client';
import { getGitCompatibleTimestamp, getGitInputs, getTagRef } from './utils';
import { setFailed } from '@actions/core';

export const run = (): void => {
  try {
    const inputs = ['tag-name', 'should-tag-with-timestamp', 'github-token'];
    const [tagName, shouldTagWithTimestamp, githubToken] = getGitInputs(inputs);
    const ref = getTagRef(tagName);
    const client = createOctokitCLient(githubToken);
    removeGitTag(ref, client);
    addGitTag(ref, client);
    if (shouldTagWithTimestamp === 'true') {
      addGitTag(`${ref}${getGitCompatibleTimestamp()}`, client);
    }
  } catch (error: any) {
    setFailed(error.message);
  }
};
