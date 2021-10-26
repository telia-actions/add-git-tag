import * as actions from '@src/github/actions';
import * as actionsGithub from '@actions/github';
import { addGitTag, createOctokitCLient, removeGitTag } from '@src/github/client';

describe('github helper functions', () => {
  describe('createOctokitCLient method', () => {
    it('should provide create octokit client with given github token', () => {
      const githubToken = 'githubToken';
      const spy = jest.spyOn(actionsGithub, 'getOctokit');
      createOctokitCLient(githubToken);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(githubToken);
    });
  });
  describe('octokit client', () => {
    const client = createOctokitCLient('githubToken');
    const [owner, repo, sha, ref] = ['owner', 'repo', 'sha', 'ref'];
    beforeEach(() => {
      jest.spyOn(actionsGithub, 'getOctokit');
      jest.spyOn(actionsGithub.context, 'repo', 'get').mockReturnValue({
        owner,
        repo,
      });
      actionsGithub.context.sha = sha;
    });
    describe('addGitTag method', () => {
      it('should send rest call to git to create reference with given ref', async () => {
        const spy = jest.spyOn(client.rest.git, 'createRef').mockImplementation();
        await addGitTag(ref, client);
        expect(spy).toBeCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({
          owner,
          repo,
          sha,
          ref,
        });
      });
    });
    describe('removeGitTag method', () => {
      describe('given that no error occurs', () => {
        it('should send rest call to git to delete reference with given ref', async () => {
          const spy = jest.spyOn(client.rest.git, 'deleteRef').mockImplementation();
          await removeGitTag(ref, client);
          expect(spy).toBeCalledTimes(1);
          expect(spy).toHaveBeenCalledWith({
            owner,
            repo,
            ref,
          });
        });
      });
      describe('given that error occurs', () => {
        it('should write to github debug log that there is nothing to delete with given ref', async () => {
          jest.spyOn(client.rest.git, 'deleteRef');
          const spy = jest.spyOn(actions, 'githubDebug').mockImplementation();
          await removeGitTag(ref, client);
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(expect.stringContaining(ref));
        });
      });
    });
  });
});
