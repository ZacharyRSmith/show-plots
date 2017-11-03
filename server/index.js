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

  TVShow.fetchImdbData({ title })
    .then(({ imdbID, totalSeasons }) =>
      TVShow.fetchEpisodeRatings({ imdbID, totalSeasons: Number(totalSeasons) }))
    .then(seasons => res.json(seasons.filter(s => !!s)))
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
