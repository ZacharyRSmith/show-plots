/**
 * @module TvShow.
 *
 * TODO: put tvShow in services/ dir.
 * @flow
 */
const get = require('lodash/get');
const range = require('lodash/range');
const request = require('request-promise-native');

// const { TV_SHOW_FILTERS } = require('../config');
const { minPopularity, minVoteCount } = {
    minVoteCount: 10, // Votes on TheMovideDB.org.
    minPopularity: 2 // Popularity on TheMovieDB.org seems to go between 1 and 10.
  };

const TMDB_API_KEY = String(process.env.TMDB_API_KEY || ''); // TODO put in config
const OMDB_API_KEY = String(process.env.OMDB_API_KEY || '');

const TvShow = {
  async fetchDetails({ id }) {
    return await request({
      json: true,
      method: 'GET',
      qs: {
        api_key: TMDB_API_KEY,
        external_source: 'imdb_id'
      },
      url: `http://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
    });
  },

  async fetchEpisodeRatings({ imdbID, totalSeasons }/*: { imdbID: string, totalSeasons: number } */) {
    async function fetchEpisodeRatingsForSeason({ season }) { // ENHANCE retry on err
      return await request({
        json: true,
        method: 'GET',
        qs: {
          apikey: OMDB_API_KEY,
          i: imdbID,
          type: 'series',
          season
        },
        url: `http://www.omdbapi.com`
      });
    }
    const seasons = range(1, totalSeasons + 1);
    return Promise.all(seasons.map(season =>
      fetchEpisodeRatingsForSeason({ season })));
  },

  async fetchImdbData({ title }/*: { title: string } */) {
    return await request({
      json: true,
      method: 'GET',
      qs: {
        apikey: OMDB_API_KEY,
        t: title,
        type: 'series'
      },
      url: 'http://www.omdbapi.com'
    });
  },

  async search({ query }/*: { query: string } */) {
    if (query.trim() === '') return Promise.resolve([]);
    const filter = show =>
      show.vote_count >= minVoteCount || show.popularity >= minPopularity; // "Min" is misleading because we're okay if one is above min, just not both.

    const body = await request({
      json: true,
      method: 'GET',
      qs: {
        api_key: TMDB_API_KEY,
        query
      },
      url: 'http://api.themoviedb.org/3/search/tv'
    });

    return get(body, 'results', []).filter(filter);
  },

  async searchTmdb({ query }/*: { query: string } */) {
    if (query.trim() === '') return Promise.resolve([]);
    return await request({
      json: true,
      method: 'GET',
      qs: {
        api_key: TMDB_API_KEY,
        query
      },
      url: 'http://api.themoviedb.org/3/search/tv'
    })
  }
};

module.exports = TvShow;
