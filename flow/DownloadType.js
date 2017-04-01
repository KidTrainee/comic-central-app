// @flow
declare type DownloadType = {|
  error: ?string,
  isLoading: boolean,
  isQueued: boolean,
  progress: number,
  isLoaded: boolean,
  filePath: ?string,
|};
