import React, { useState, useRef } from 'react'
import debounce from 'lodash.debounce';
import Movie from '../components/Movie';

export default function SearchMoviePage() {
  const SearchTitleRef = useRef();
  const SearchYearRef = useRef();
  const [errorMessage, setErrorMessage] = useState();
  const [moviesData, setMoviesData] = useState();
  const [page, setPage] = useState(1);
  const [maxNumOfPages, setMaxNumOfPages] = useState(1);
  const [loadAmount, setLoadAmount] = useState(10);

  const searchHandler = debounce(() => {
    const url = `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${SearchTitleRef.current.value}&y=${SearchYearRef.current.value}&page=${page}`;

    if (SearchTitleRef.current.value && SearchTitleRef.current.value.split('')[0] !== ' ') {
      fetch(url).then(res => res.json())
        .then(res => {
          if (res.Response === 'True') {
            const movieImdbIDS = [];
            res.Search.forEach(movie => {
              movieImdbIDS.push(movie.imdbID);
            });
            console.log(res);
            setMaxNumOfPages((res.totalResults % loadAmount) !== 0 ? parseInt(res.totalResults / loadAmount) + 1 : parseInt(res.totalResults / loadAmount));
            getMoviesData(movieImdbIDS);
            setErrorMessage('');
          } else {
            setErrorMessage(res.Error);
          }
        });
    }
  }, 1000);

  async function getMoviesData(movieImdbIDS) {
    const movies = [];
    for (let i = 0; i < movieImdbIDS.length; i++) {
      const movieID = movieImdbIDS[i];
      const res = await fetch(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&i=${movieID}`);
      const jsonRes = await res.json();
      movies.push(jsonRes);
    }
    setMoviesData(movies);
  }

  function renderMovies() {
    const movieList = moviesData.map(movieData => {
      return <Movie movieDetails={movieData} key={movieData.imdbID} />
    });
    return movieList;
  }

  function sortByLength() {
    let sortedByTitle = [...moviesData].sort((a, b) => {
      if (a.length > b.length) {
        return 1
      } else {
        return -1;
      }
    });
    setMoviesData(sortedByTitle);
  }

  function sortByYear() {
    /**
     * Find sorting most efficent sorting algorithm
     */
    console.log(moviesData);
    let sortedByTitle = [...moviesData].sort((a, b) => {
      if (a > b) {
        console.log('a.Year > b.Year', a.Year > b.Year)
        return 1
      } else {
        console.log('a.Year > b.Year', a.Year > b.Year)
        return -1;
      }
    });
    console.log(sortedByTitle);
    setMoviesData(sortedByTitle);
  }

  return (
    <div>
      <div className="my-5">
        <p className='text-danger'>{errorMessage}</p>
        <span>Keyword</span>
        <input
          type="text"
          className="form-control col-4"
          placeholder="Movie Title"
          ref={SearchTitleRef}
          onChange={() => searchHandler()}
        />
        <span>Year</span>
        <input
          type="number"
          className="form-control col-2"
          placeholder="Year"
          ref={SearchYearRef}
          onChange={() => searchHandler()}
        />
      </div>
      <div className="d-flex flex-wrap justify-content-center">
        <table className="table my-5">
          <thead>
            <tr>
              <th scope="col" onClick={() => { sortByLength() }}>Title</th>
              <th scope="col" onClick={() => { sortByYear() }}>Year</th>
              <th scope="col" onClick={() => { sortByLength() }}>Genre</th>
              <th scope="col" onClick={() => { sortByLength() }}>Description</th>
              <th scope="col" onClick={() => { sortByLength() }}>Actors</th>
              <th scope="col">Poster</th>
            </tr>
          </thead>
          <tbody>
            {moviesData !== undefined ? renderMovies() : ''}
          </tbody>
        </table>
        <div className="my-5">
          <input className="btn btn btn-outline-primary mx-1" type="button" value="&laquo;" />
          <input className="btn btn-primary mx-1" type="button" value={page - 1} disabled={page - 1 <= 0 ? true : false} />
          <input className="btn btn-primary mx-1" type="button" value={page} disabled />
          <input className="btn btn-primary mx-1" type="button" value={page + 1} disabled={page + 1 >= maxNumOfPages ? true : false} />
          <input className="btn btn btn-outline-primary mx-1" type="button" value="&raquo;" />
        </div>
      </div>
    </div>
  )
}
