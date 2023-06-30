export interface IUploadFileToS3FromUrlInput {
  url: string;
  bucket: string;
  keyWithoutExt: string;
}

export interface IUploadFileToS3Input {
  bucket: string;
  file: Buffer;
  key: string;
}

export enum ES3Operation {
  putObject = 'putObject',
  getObject = 'getObject',
}

export enum ES3Acl {
  publicRead = 'public-read',
}
