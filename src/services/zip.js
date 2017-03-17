// @flow

import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';

const outputPath = `${RNFS.DocumentDirectoryPath}/current`;

export function loadFiles(filePath) {
  return RNFS.unlink(outputPath)
    .catch(() => {})
    .then(() => RNFS.mkdir(outputPath))
    .then(() => unzip(filePath, outputPath))
    .then(() => RNFS.readDir(outputPath));
}
