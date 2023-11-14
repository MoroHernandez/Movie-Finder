import './App.css';
import { Movies } from './components/Movies';
import { useMovies } from './hooks/useMovies';
import { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'just-debounce-it';

function useSearch() {
	const [search, updateSearch] = useState('');
	const [error, setError] = useState(null);
	const isFirstInput = useRef(true);

	useEffect(() => {
		if (isFirstInput.current) {
			isFirstInput.current = search === '';
			return;
		}
		if (search === '') {
			setError('Can not be an empty input');
			return;
		}

		if (search.match(/^\d+$/)) {
			setError('Can not find a movie title with numbers');
			return;
		}

		if (search.length < 3) {
			setError('Search must be longer than 3 characters');
			return;
		}

		setError(null);
	}, [search]);
	return { search, updateSearch, error };
}

function App() {
	const [sort, setSort] = useState(false);

	const { search, updateSearch, error } = useSearch();
	const { movies, loading, getMovies } = useMovies({ search, sort });

	const debouncedGetMovies = useCallback(
		debounce(search => {
			console.log('renderiza');
			getMovies({ search });
		}, 300),
		[getMovies],
	);

	const handleSubmit = event => {
		event.preventDefault();
		getMovies({ search });
	};

	const handleSort = () => {
		setSort(!sort);
	};

	const handleChange = event => {
		const newSearch = event.target.value;
		updateSearch(newSearch);
		debouncedGetMovies(newSearch);
	};

	return (
		<div className='page'>
			<header>
				<h1>Movie Finder</h1>
				<form className='form' onSubmit={handleSubmit}>
					<input
						onChange={handleChange}
						value={search}
						name='query'
						placeholder='Avengers, Star Wars, ...'
					/>
					<input type='checkbox' onChange={handleSort} checked={sort} />
					<button type='submit'>Find</button>
				</form>
				{error && <p style={{ color: 'red' }}>{error}</p>}
			</header>

			<main>{loading ? <p>Loading...</p> : <Movies movies={movies} />}</main>
		</div>
	);
}

export default App;
