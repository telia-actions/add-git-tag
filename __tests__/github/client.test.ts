import * as actions from '@src/github/actions';
import * as actionsGithub from '@actions/github';
import { addGitTag, createOctokitClient, removeGitTag } from '@src/github/client';

describe('github helper functions', () => {
  describe('createOctokitCLient method', () => {
    it('should provide create octokit client with given github token', () => {
      const githubToken = 'githubToken';
      const spy = jest.spyOn(actionsGithub, 'getOctokit');
      createOctokitClient(githubToken);
      expect(spy).toHaveBeenCalledWith(githubToken);
      expect(spy).toBeCalledTimes(1);
    });
  });
  describe('octokit client', () => {
    const client = createOctokitClient('githubToken');
    const [owner, repo, sha, ref] = ['owner', 'repo', 'sha', 'ref'];
    beforeEach(() => {
      jest.spyOn(actionsGithub, 'getOctokit');
      jest.spyOn(actionsGithub.context, 'repo', 'get').mockReturnValue({
        owner,
        repo,
      });
    });
    describe('addGitTag method', () => {
      it('should send rest call to git to create reference with given ref on specific sha', async () => {
        const spy = jest.spyOn(client.rest.git, 'createRef').mockImplementation();
        await addGitTag(ref, sha, client);
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
