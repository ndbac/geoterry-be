import _ from 'lodash';
import minimist from 'minimist';
import { isPhoneNumber } from 'class-validator';
import { Request } from 'express';
import crypto from 'crypto';
import slugify from 'slugify';

export const convertErrorToLogData = (err: any) => ({
  err,
  errStack: err?.stack,
  errStr: String(err),
});

export const executeSubsequentPromises = (
  promises: (() => Promise<void>)[],
) => {
  return promises.reduce((aggPromise, curPromise) => {
    return aggPromise.then(() => curPromise());
  }, Promise.resolve());
};

export const tryParseStringToJson = <T = any>(
  str?: string | null,
): T | string => {
  try {
    const res = JSON.parse(str || '');
    return res;
  } catch (error) {
    return str?.toString() || '';
  }
};

export const parseCommandArgs = <T>(
  opts?: minimist.Opts,
  selectKeys?: (keyof T)[],
) => {
  const res = minimist<T>(process.argv.slice(2), opts);
  if (!selectKeys) {
    return res;
  }
  return _.pick(res, selectKeys);
};

export const getBearerTokenFromRequest = (req: Request) => {
  if (!req.headers) {
    return undefined;
  }

  const authHeader =
    req.headers['authorization'] || req.headers['proxy-authorization'];

  if (authHeader) {
    const tokens = authHeader.split(' ');
    return tokens[0] === 'Bearer' ? tokens[1] : undefined;
  }
  return undefined;
};

export const convertEnumToArray = (enumType: any) => {
  return Object.values(enumType).map((value) => value);
};

export const waitForMs = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const regExpEscape = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Content-Type: image/png => .png
export const getFileExtensionFromContentType = (contentType: string) => {
  const values = contentType.split('/');
  if (values.length < 2) {
    return '.';
  }
  return `.${values[1]}`;
};

export const isValidPhoneNumber = (phoneNumber: string) => {
  return isPhoneNumber(phoneNumber) && /^\+[0-9]{1,15}$/.test(phoneNumber);
};

export const generateRandomString = (length: number) => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateSlugFromString = (text: string) => {
  return slugify(text, { lower: true }) || generateRandomString(20);
};

export const maskedString = (input: string) => {
  if (input.length < 4) {
    return input;
  }
  const firstTwoChars = input.slice(0, 2);
  const lastChar = input.slice(-1);
  const maskedChars = '*'.repeat(input.length - 3);
  return `${firstTwoChars}${maskedChars}${lastChar}`;
};
