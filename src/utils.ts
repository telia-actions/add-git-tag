import { getInput } from '@actions/core';

export const getGitCompatibleTimestamp = (): string =>
  `_${new Date()
    .toISOString()
    .replace(/(?::|\..*)/g, '')
    .replace('T', '-')}`;

export const getTagRef = (tagName: string): string => `refs/tags/${tagName}`;

export const getTag = (tagName: string): string => `tags/${tagName}`;

export const getGitInputs = (inputs: string[]): string[] => inputs.map((input) => getInput(input));
