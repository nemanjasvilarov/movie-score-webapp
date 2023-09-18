import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    name: String,
    score: Number,
    IMDBScore: Number,
    poster: String,
    imdbID: String,
    votes: []
});

const Movie = new mongoose.model('movie', movieSchema);

export { Movie };