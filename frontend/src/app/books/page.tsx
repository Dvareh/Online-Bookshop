'use client';

import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import GenreFilter from '@/components/GenreFilter';
import FilterPanel from '@/components/FilterPanel';
import { searchBooks, getGenres } from '@/api';
import type { Genre } from '@/api';
import type { Book } from '@/store/slices/booksSlice';

const PAGE_SIZE = 10;

const Page = styled.div`
  min-height: 100vh;
  background: #f5f0ea;
`;

const Content = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 40px;
`;

const PageTitle = styled.h1`
  font-family: 'Georgia', serif;
  font-size: 28px;
  color: #3d2f1e;
  margin: 0 0 24px 0;
`;

const Layout = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
`;

const Main = styled.div`
  flex: 1;
  min-width: 0;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 180px;
  padding: 10px 14px;
  border: 1px solid #c8bfb4;
  border-radius: 8px;
  font-size: 14px;
  color: #3d2f1e;
  background: #fff;
  outline: none;

  &::placeholder {
    color: #b0a090;
  }

  &:focus {
    border-color: #7a6248;
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

const ResultCount = styled.p`
  font-size: 14px;
  color: #9a8a7a;
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Message = styled.p`
  font-size: 14px;
  color: #9a8a7a;
  text-align: center;
  padding: 48px 0;
`;

const Spinner = styled.div`
  text-align: center;
  padding: 48px 0;
  font-size: 14px;
  color: #9a8a7a;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
`;

const PageButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 20px;
  border: 1px solid #c8bfb4;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? '#f0ebe5' : '#fff')};
  color: ${({ disabled }) => (disabled ? '#b0a090' : '#3d2f1e')};
  font-size: 14px;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #e8e3dc;
  }
`;

const PageIndicator = styled.span`
  font-size: 14px;
  color: #5a4a3a;
`;

const SortRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SortLabel = styled.span`
  font-size: 14px;
  color: #5a4a3a;
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #c8bfb4;
  border-radius: 6px;
  font-size: 14px;
  color: #3d2f1e;
  background: #fff;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #7a6248;
  }
`;

const SORT_OPTIONS = [
  { label: 'Domyślnie', value: '' },
  { label: 'Cena rosnąco', value: 'price,asc' },
  { label: 'Cena malejąco', value: 'price,desc' },
  { label: 'Tytuł A–Z', value: 'title,asc' },
  { label: 'Tytuł Z–A', value: 'title,desc' },
];

function matchesYearRange(year: number | undefined, range: string): boolean {
  if (year === undefined || year === null) return false;
  if (range === 'Przed 1900') return year < 1900;
  if (range === '1900–1950') return year >= 1900 && year <= 1950;
  if (range === '1950–2000') return year > 1950 && year <= 2000;
  if (range === 'Po 2000') return year > 2000;
  return true;
}

const DEFAULT_GENRES: Genre[] = [
  { id: 1, name: 'Romance' },
  { id: 2, name: 'Classics' },
  { id: 3, name: 'Dystopian' },
  { id: 4, name: 'Science Fiction' },
  { id: 5, name: 'Horror' },
  { id: 6, name: 'Philosophy' },
];

export default function BooksPage() {
  const [titleInput, setTitleInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [debouncedTitle, setDebouncedTitle] = useState('');
  const [debouncedAuthor, setDebouncedAuthor] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(0);

  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [genres, setGenres] = useState<Genre[]>(DEFAULT_GENRES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedTitle(titleInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(t);
  }, [titleInput]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedAuthor(authorInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(t);
  }, [authorInput]);

  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    searchBooks({
      title: debouncedTitle || undefined,
      author: debouncedAuthor || undefined,
      genreId: selectedGenreId,
      sort: sort || undefined,
      page,
      size: PAGE_SIZE,
    })
      .then((data) => {
        if (cancelled) return;
        setBooks(data.content ?? []);
        setTotal(data.totalElements ?? 0);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedTitle, debouncedAuthor, selectedGenreId, sort, page]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const min = priceMin !== '' ? Number(priceMin) : null;
      const max = priceMax !== '' ? Number(priceMax) : null;
      if (min !== null && book.price < min) return false;
      if (max !== null && book.price > max) return false;
      if (selectedYear && !matchesYearRange(book.publicationYear, selectedYear)) return false;
      if (selectedGenres.length > 0) {
        const bookGenres = book.genres ?? [];
        if (!selectedGenres.some((g) => bookGenres.includes(g))) return false;
      }
      return true;
    });
  }, [books, priceMin, priceMax, selectedYear, selectedGenres]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleGenreChange = (id: number | undefined) => {
    setSelectedGenreId(id);
    setPage(0);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(0);
  };

  return (
    <Page>
      <Navbar />
      <Content>
        <PageTitle>Szukaj książek</PageTitle>

        <SearchRow>
          <SearchInput
            placeholder="Tytuł..."
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
          <SearchInput
            placeholder="Autor..."
            value={authorInput}
            onChange={(e) => setAuthorInput(e.target.value)}
          />
        </SearchRow>

        <Layout>
          <FilterPanel
            showSearch={false}
            priceMin={priceMin}
            priceMax={priceMax}
            onPriceMinChange={setPriceMin}
            onPriceMaxChange={setPriceMax}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            genres={genres.map((g) => g.name)}
            selectedGenres={selectedGenres}
            onGenresChange={setSelectedGenres}
          />

          <Main>
            <FilterRow>
              <GenreFilter
                genres={genres}
                value={selectedGenreId}
                onChange={handleGenreChange}
              />
              <SortRow>
                <SortLabel>Sortuj:</SortLabel>
                <SortSelect
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </SortSelect>
              </SortRow>
              <ResultCount>
                Znaleziono {filteredBooks.length} książek
                {(priceMin || priceMax || selectedYear) && total !== filteredBooks.length
                  ? ` (filtrowanie z ${total})`
                  : ''}
              </ResultCount>
            </FilterRow>

            {loading && <Spinner>Ładowanie...</Spinner>}

            {!loading && error && <Message>Błąd: {error}</Message>}

            {!loading && !error && filteredBooks.length === 0 && (
              <Message>Nie znaleziono żadnych książek.</Message>
            )}

            {!loading && !error && filteredBooks.length > 0 && (
              <>
                <Grid>
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      price={book.price}
                      genres={book.genres}
                      coverUrl={book.coverUrl}
                    />
                  ))}
                </Grid>

                {totalPages > 1 && (
                  <Pagination>
                    <PageButton
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      ← Poprzednia
                    </PageButton>
                    <PageIndicator>
                      Strona {page + 1} z {totalPages}
                    </PageIndicator>
                    <PageButton
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Następna →
                    </PageButton>
                  </Pagination>
                )}
              </>
            )}
          </Main>
        </Layout>
      </Content>
    </Page>
  );
}
