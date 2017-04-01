// @flow

import RNFetch from 'react-native-fetch-blob';
import { unzip } from 'react-native-zip-archive';

export const outputPath = `${RNFetch.fs.dirs.CacheDir}/current`;

export function loadFiles(filePath: string) {
  return RNFetch.fs
    .unlink(outputPath)
    .then(() => RNFetch.fs.mkdir(outputPath))
    .then(() => unzip(filePath, outputPath))
    .then(() => RNFetch.fs.ls(outputPath))
    .then(data => {
      console.log(data);
      return data;
    });
}
