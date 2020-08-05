import React from 'react'

export default function Movie(props) {

  return (
    <tr>
      <th scope="row">{props.movieDetails.Title !== undefined ? props.movieDetails.Title : ''}</th>
      <td>{props.movieDetails.Year !== undefined ? props.movieDetails.Year : ''}</td>
      <td>{props.movieDetails.Genre !== undefined ? props.movieDetails.Genre : ''}</td>
      <td>{props.movieDetails.Plot !== undefined ? props.movieDetails.Plot : ''}</td>
      <td>{props.movieDetails.Actors !== undefined ? props.movieDetails.Actors : ''}</td>
      <td><img src={props.movieDetails.Poster} alt="" /></td>
    </tr>
  )
}
