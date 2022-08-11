import * as dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';
import { Movie } from './Model/movie.js';
import { fetchMoviesData, fetchMovieDetails } from './helper-functions/fetchdata.js';
import sortMovies from './helper-functions/sort.js';

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGODBACCESS);

app.get('/', (req, res) => {
    res.render('movies', { movies: [{}] });
});

app.get('/movies', async (req, res) => {
    const data = await fetchMoviesData(req.query);
    res.render('movies', { movies: data });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/scores', (req, res) => {
    Movie.find((err, foundMovies) => {
        if (err) {
            //console.log(err);
            res.statusCode(500).json(err);
        } else {
            res.render('moviesscore', { movies: foundMovies });
        }
    });
});

app.post('/score/:name/:IMDBScore', (req, res) => {
    const { name, IMDBScore } = req.params;
    const { score: visitorScore, poster } = req.body;
    Movie.findOne({ name: name }, (err, foundMovie) => {
        if (err) {
            //console.log(err)
            res.statusCode(500).send({
                message: err
            });
        } else {
            if (foundMovie) {
                const { votes: foundVotes, score: foundScore } = foundMovie;
                foundVotes.push(visitorScore);
                const sum = foundVotes.reduce((total, next) => {
                    return total + parseInt(next);
                }, 0);
                let newScore = parseFloat(sum / foundVotes.length).toFixed(1);
                Movie.updateOne({ name: name }, { votes: foundVotes, score: newScore }, (err) => {
                    if (err) {
                        //console.log(err);
                        res.statusCode(500).send({
                            message: err
                        });
                    } else {
                        console.log('Updating votes was successful')
                        res.redirect('/scores');
                    }
                });
            }
            else {
                const movie = new Movie({
                    name: name,
                    score: visitorScore,
                    poster: poster,
                    IMDBScore: IMDBScore,
                    votes: visitorScore
                });
                movie.save((err) => {
                    if (err) {
                        //console.log(err);
                        res.statusCode(500).send({
                            message: err
                        });
                    } else {
                        console.log('Adding movie was successful')
                        res.redirect('/scores');
                    }
                });
            }
        }
    });
});

app.get('/scores/sort', (req, res) => {
    const { sortScore } = req.query;
    Movie.find((err, foundMovies) => {
        if (err) {
            //console.log(err);
            res.statusCode(500).send({
                message: err
            });
        } else {
            const sortedMovies = sortMovies(foundMovies, sortScore);
            res.render('moviesscore', { movies: sortedMovies });
        }
    });
})

app.get('/details/:id', async (req, res) => {
    const data = await fetchMovieDetails(req.params.id);
    res.render('moviedetailes', { movie: data });
});


app.listen(process.env.PORT || 3000, () => {
    console.log('Server started on port 3000...');
});
