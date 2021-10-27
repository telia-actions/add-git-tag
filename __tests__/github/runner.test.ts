import * as actions from '@src/github/actions';
import * as githubClient from '@src/github/client';
import * as utils from '@src/utils';
import { run } from '@src/github/runner';

const mockedTagReference = 'ref';

const mockGithubClient = (): any => {
  const clientSpy = jest.spyOn(githubClient, 'createOctokitClient').mockImplementation();
  const addTagSpy = jest.spyOn(githubClient, 'addGitTag').mockResolvedValue();
  const removeTagSpy = jest.spyOn(githubClient, 'removeGitTag').mockResolvedValue();
  return { clientSpy, addTagSpy, removeTagSpy };
};

describe('github action runner', () => {
  describe('given that the error does not occur', () => {
    it('should get 3 required inputs from github', async () => {
      mockGithubClient();
      const spy = jest.spyOn(utils, 'getGitInputs');
      await run();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(['tag-name', 'should-tag-with-timestamp', 'github-token']);
    });
    describe('given that inputs provided', () => {
      beforeEach(() => {
        jest.spyOn(utils, 'getGitInputs').mockReturnValue(['tag-name', 'false', 'github-token']);
      });
      it('should get tag reference with given tag name ', async () => {
        mockGithubClient();
        const spy = jest.spyOn(utils, 'getTagRef');
        await run();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('tag-name');
      });
      describe('given that tag reference exists', () => {
        beforeEach(() => {
          jest.spyOn(utils, 'getTagRef').mockReturnValue(mockedTagReference);
        });
        it('should create client with githubToken', async () => {
          const { clientSpy } = mockGithubClient();
          await run();
          expect(clientSpy).toHaveBeenCalledTimes(1);
          expect(clientSpy).toHaveBeenCalledWith('github-token');
        });
        it('should remove tag ref using client', async () => {
          const { removeTagSpy, clientSpy } = mockGithubClient();
          await run();
          expect(removeTagSpy).toHaveBeenCalledTimes(1);
          expect(removeTagSpy).toHaveBeenCalledWith(
            mockedTagReference,
            clientSpy.getMockImplementation()
          );
        });
        it('should add tag ref using client', async () => {
          const { addTagSpy, clientSpy } = mockGithubClient();
          await run();
          expect(addTagSpy).toHaveBeenCalledTimes(1);
          expect(addTagSpy).toHaveBeenCalledWith(
            mockedTagReference,
            clientSpy.getMockImplementation()
          );
        });
      });
    });
    describe('given that inputs provided and tag with timestamp required', () => {
      it('should add tag ref with timestamp using client', async () => {
        const timestamp = 'timestamp';
        jest.spyOn(utils, 'getGitInputs').mockReturnValue(['tag-name', 'true', 'github-token']);
        jest.spyOn(utils, 'getGitCompatibleTimestamp').mockReturnValue(timestamp);
        jest.spyOn(utils, 'getTagRef').mockReturnValue(mockedTagReference);
        const { addTagSpy, clientSpy } = mockGithubClient();
        await run();
        expect(addTagSpy).toHaveBeenNthCalledWith(
          2,
          `${mockedTagReference}${timestamp}`,
          clientSpy.getMockImplementation()
        );
      });
    });
  });
  describe('given that error occurs', () => {
    it('should terminate runner and write error to github logs', async () => {
      const errorMessage = 'error message';
      jest.spyOn(githubClient, 'createOctokitClient').mockImplementation(() => {
        throw new Error(errorMessage);
      });
      const spy = jest.spyOn(actions, 'githubSetFailed').mockImplementation();
      await run();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(errorMessage);
    });
  });
});
