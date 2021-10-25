import * as actionsCore from '@actions/core';
import { getGitCompatibleTimestamp, getGitInputs, getTagRef } from '../src/utils';

describe('utilities helper functions', () => {
  describe('getGitCompatibleTimestamp method', () => {
    it('should return current timestamp in yyyy-MM-dd-hhmmss format', () => {
      const expectedDateFormatRegex = /\d{4}-\d{2}-\d{2}-\d{6}/;
      expect(getGitCompatibleTimestamp()).toEqual(expect.stringMatching(expectedDateFormatRegex));
    });
  });
  describe('getGitInputs method', () => {
    const inputs = ['input1', 'input2', 'input3'];
    it('should get git inputs for every provided input', () => {
      const spy = jest.spyOn(actionsCore, 'getInput');
      getGitInputs(inputs);
      expect(spy).toHaveBeenNthCalledWith(1, inputs[0]);
      expect(spy).toHaveBeenNthCalledWith(2, inputs[1]);
      expect(spy).toHaveBeenNthCalledWith(3, inputs[2]);
    });
    it('should return array of strings', () => {
      jest.spyOn(actionsCore, 'getInput');
      const gitInputs = getGitInputs(inputs);
      expect(gitInputs).toBeInstanceOf(Array);
      expect(typeof gitInputs[0]).toBe('string');
    });
  });
  describe('getTagRef method', () => {
    it('should concatinate tag name with git ref prefix', () => {
      const tagName = 'mockedTagName';
      expect(getTagRef(tagName)).toEqual(`refs/tags/${tagName}`);
    });
  });
});
