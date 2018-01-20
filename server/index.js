/* @flow */
const bodyParser = require('body-parser'); // ENHANCE? rm this?
const express = require('express');

const TVShow = require('./tvShow');

const NODE_ENV = String(process.env.NODE_ENV || '');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());
if (NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
}

app.get('/api/episode-ratings', (req, res) => {
  const { title } = req.query;
  const addMissingEps = (season) => {
    const epsMap = new Map(season.Episodes.map(ep => [parseInt(ep.Episode, 10), ep]));
    const latestEp = parseInt(season.Episodes.slice(-1)[0].Episode, 10);
    const newEps = [];
    for (let i = 0; i < latestEp; i++) {
      newEps.push(epsMap.get(i + 1) || { Title: 'N/A', Released: 'N/A', Episode: String(i + 1), imdbRating: 'N/A' });
    }
    season.Episodes = newEps;
    return season;
  };

  TVShow.fetchImdbData({ title })
    .then(({ imdbID, totalSeasons }) =>
      TVShow.fetchEpisodeRatings({ imdbID, totalSeasons: Number(totalSeasons) }))
    .then(seasons => res.json(seasons.filter(s => !!s).map(addMissingEps)))
    .catch(() => res.sendStatus(500));
});

app.get('/api/search', (req, res) => {
  const { query } = req.query;

  TVShow.search({ query })
    .then(shows => res.json(shows))
    .catch(() => res.sendStatus(500));
});

app.listen(PORT, () => {
  console.log(`Find the server at: http://localhost:${PORT}/`); // eslint-disable-line no-console
});
