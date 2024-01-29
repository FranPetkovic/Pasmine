// pages/index.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/index.css';

const HomePage = ({ breeds }) => {
  const [sortedBreeds, setSortedBreeds] = useState([...breeds]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [randomBreed, setRandomBreed] = useState('');
  const [error, setError] = useState(null);  // New state for error handling
  const router = useRouter();

  useEffect(() => {
    sortBreeds();
  }, [breeds, sortOrder, searchQuery]);

  const sortBreeds = () => {
    try {
      let sorted = [...breeds];

      // Apply sorting
      sorted = sorted.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.localeCompare(b);
        } else {
          return b.localeCompare(a);
        }
      });

      // Apply search filter
      if (searchQuery) {
        sorted = sorted.filter((breed) =>
          breed.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setSortedBreeds(sorted);
      setError(null);  // Reset error state on successful operation
    } catch (error) {
      setError('Error sorting and filtering breeds.');
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchRandomBreed = async () => {
    try {
      const randomIndex = Math.floor(Math.random() * sortedBreeds.length);
      const randomBreed = sortedBreeds[randomIndex];
      setRandomBreed(randomBreed);

      // Redirect to the details page for the random breed
      router.push(`/breed/${encodeURIComponent(randomBreed)}`);
      setError(null);  // Reset error state on successful operation
    } catch (error) {
      setError('Error fetching random breed.');
    }
  };

  return (
    <div>
      <div class="about-block__title-wrapper dt-contaniner">
        <h1 class="title dt-gradient">Pasmine pasa</h1>
      </div>

      <div class="filters">
        <input
          type="text"
          placeholder="Tražilica"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button onClick={toggleSortOrder}>
          Sortiraj {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
        </button>
        <button onClick={fetchRandomBreed}>Slučajna pasmina</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {sortedBreeds.map((breed) => (
          <li key={breed}>
            <Link href={`/breed/${encodeURIComponent(breed)}`}>
              {breed}
            </Link>
          </li>
        ))}
      </ul>
      {randomBreed && (
        <div>
          <h2>Slučajna pasmina: {randomBreed}</h2>
          <p>
            <Link href={`/breed/${encodeURIComponent(randomBreed)}`}>
              View Details
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export async function getStaticProps() {
  try {
    const res = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await res.json();

    const breeds = Object.keys(data.message);

    return {
      props: {
        breeds,
      },
    };
  } catch (error) {
    return {
      props: {
        breeds: [],
        error: 'Error fetching the list of dog breeds.',
      },
    };
  }
}

export default HomePage;
