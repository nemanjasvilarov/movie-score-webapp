import * as dotenv from 'dotenv'
dotenv.config();
import axios from 'axios';

const fetchMoviesData = async (searchTerms) => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {
            apikey: process.env.APIKEY,
            s: searchTerms.title,
            type: searchTerms.type,
            y: searchTerms.year
        }
    });

    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
};

const fetchMovieDetails = async (id) => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {
            apikey: process.env.APIKEY,
            i: id
        }
    });

    if (response.data.Error) {
        return {};
    }

    return response.data;
}

export { fetchMoviesData, fetchMovieDetails };
