import * as fs from 'fs';

export const fsMock = {
  writtenFiles: {},
  directoryMode: 0o777,

  writeFileSync: jest.fn((filePath: string, data: any, options?: fs.WriteFileOptions) => {
    fsMock.writtenFiles[filePath] = data;
  }),

  readFileSync: jest.fn((filePath: string, encoding?: string) => {
    // For this mock, we assume the log file contains a string with newline-separated log entries.
    // We split the content by newline and return it as an array of lines.
    const fileContent = fsMock.writtenFiles[filePath] || '';
    return fileContent.split('\n');
  }),

  existsSync: jest.fn((filePath: string) => {
    return filePath in fsMock.writtenFiles;
  }),

  mkdirSync: jest.fn((dirPath: string, options?: number | fs.MakeDirectoryOptions) => {
    if (options && typeof options === 'number') {
      fsMock.directoryMode = options;
    }
    fsMock.writtenFiles[dirPath] = 'directory';
  }),

  rmdirSync: jest.fn((dirPath: string, options?: fs.RmDirOptions) => {
    delete fsMock.writtenFiles[dirPath];
  }),
};
