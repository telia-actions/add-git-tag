import * as githubActions from '@actions/core';
import { githubDebug, githubSetFailed } from '@src/github/actions';

describe('github actions helper functions', () => {
  describe('githubDebug method', () => {
    it('should call github debugger with given message', () => {
      const message = 'message';
      const spy = jest.spyOn(githubActions, 'debug').mockImplementation();
      githubDebug(message);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(message);
    });
  });
  describe('githubSetFailed method', () => {
    it('should call github failure with given message', () => {
      const message = 'message';
      const spy = jest.spyOn(githubActions, 'setFailed').mockImplementation();
      githubSetFailed(message);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(message);
    });
  });
});
