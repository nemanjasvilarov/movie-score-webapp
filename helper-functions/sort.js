const sortByScore = (movies, scoreType) => {
    const sortedMovies = movies;
    if (scoreType === 'visitors score') {
        sortedMovies.sort((a, b) => b.score - a.score);
    } else if (scoreType === 'IMDB score') {
        sortedMovies.sort((a, b) => b.IMDBScore - a.IMDBScore);
    } else {
        return movies;
    }
    return sortedMovies;
}

export default sortByScore;