/**
 * @module TvShow test suite.
 *
 * @flow
 */
const TvShow = require('.');

const imdbIDForTheWire = 'tt0306414';

describe('TvShow', () => {
  describe('async fetchEpisodeRatings()', () => {
    it('works', () => {
      const assertExpected = episodeRatings =>
        expect(episodeRatings).toMatchSnapshot();
      return TvShow.fetchEpisodeRatings({ imdbID: imdbIDForTheWire, totalSeasons: 5 })
        .then(assertExpected);
    });
  });

  describe('async fetchImdbData()', () => {
    it('works', () => {
      const assertExpected = imdbData =>
        expect(imdbData).toMatchSnapshot();
      return TvShow.fetchImdbData({ title: 'The Wire' }).then(assertExpected);
    });
  });

  describe('async fetchDetails()', () => {
    it('works', () => {
      const assertExpected = details =>
        expect(details).toMatchSnapshot();
      return TvShow.fetchDetails({ id: imdbIDForTheWire }).then(assertExpected);
    });
  });

  describe('async search()', () => {
    it('filters out unpopular shows', () => {
      const assertExpected = shows => {
        expect(shows.length).toBe(2);
        expect(shows[0]).toMatchSnapshot();
        expect(shows[0].original_name).toBe('The Wire');
      }
      return TvShow.search({ query: 'wire' }).then(assertExpected);
    });

    it('returns `[]` if provided no query', () => {
      const assertExpected = shows =>
        expect(shows).toEqual([]);
      return TvShow.search({ query: '\n \t' }).then(assertExpected);
    });
  });

  describe('async searchImdb()', () => {
    it('works', () => {
      const assertExpected = results =>
        expect(results).toMatchSnapshot();
      return TvShow.search({ query: 'wire' }).then(assertExpected);
    });
  });
});
