export const getComic = (state, _id: string): ComicType =>
  state.apollo.data[`comic${_id}`];
