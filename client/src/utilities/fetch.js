/* @flow */
export const fJSON = (url: string) => {
  return fetch(url, { accept: 'application/json' })
    .then(res => res.json());
}
