// pages/breed/[breedName].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const PAGE_SIZE = 10; // Number of images per page
const MAX_DISPLAY_PAGES = 3; // Maximum number of adjacent pages to display

const BreedPage = ({ breed, images }) => {
  const router = useRouter();
  const { page } = router.query;
  const currentPage = parseInt(page, 10) || 1;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentImages = images.slice(startIndex, endIndex);

  const totalPages = Math.ceil(images.length / PAGE_SIZE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/breed/${breed}?page=${newPage}`);
    }
  };

  const getDisplayedPages = () => {
    const middlePage = Math.min(Math.max(currentPage, 2), totalPages - 1);
    const startPage = Math.max(1, middlePage - Math.floor(MAX_DISPLAY_PAGES / 2));
    const endPage = Math.min(totalPages, startPage + MAX_DISPLAY_PAGES - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };
  const handleGoBack = () => {
    router.push('/');
  };
  return (
    <div>
      <div class="about-block__title-wrapper dt-contaniner">
        <h1 class="title dt-gradient">{breed}</h1>
      </div>
      <p className='goBack' onClick={handleGoBack}>Natrag na sve pasmine</p>
      <div className='images'>
        {currentImages.map((image, index) => (
          <img key={index} src={image} alt={`${breed} dog`} />
        ))}
      </div>
      <div className='navigation'>
        <p onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          Prva
        </p>
        <p onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Prošla
        </p>
        {getDisplayedPages().map((pageNumber) => (
          <span
            key={pageNumber}
            style={{
              marginRight: '5px',
              cursor: 'pointer',
              textDecoration: currentPage === pageNumber ? 'underline' : 'none',
            }}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </span>
        ))}
        <p
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Slijedeća
        </p>
        <p onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          Zadnja
        </p>

      </div>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const { breedName } = params;
  const res = await fetch(`https://dog.ceo/api/breed/${breedName}/images`);
  const data = await res.json();

  return {
    props: {
      breed: breedName,
      images: data.message,
    },
  };
}

export default BreedPage;
