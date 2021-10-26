import { debug, setFailed } from '@actions/core';

export const githubDebug = (message: string): void => debug(message);

export const githubSetFailed = (message: string): void => setFailed(message);
