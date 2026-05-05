'use client';

import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import FilterPanel from './FilterPanel';
import BookCard from './BookCard';
import { searchBooks, getGenres } from '@/api';
import type { Genre } from '@/api';
import type { Book } from '@/store/slices/booksSlice';

const Content = styled.main`
  display: flex;
  gap: 24px;
  padding: 32px 40px;
  max-width: 1400px;
  margin: 0 auto;
`;

const BookArea = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const Count = styled.p`
  font-size: 14px;
  color: #9a8a7a;
  margin: 0;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Message = styled.p`
  font-size: 14px;
  color: #9a8a7a;
  padding: 48px 0;
  text-align: center;
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

export default function CatalogClient() {
  const [genres, setGenres] = useState<Genre[]>(DEFAULT_GENRES);
  const [activeCategory, setActiveCategory] = useState('Wszystkie');
  const [sort, setSort] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getGenres().then(setGenres).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const genreNames = useMemo(() => genres.map((g) => g.name), [genres]);

  const activeGenreId = useMemo<number | undefined>(() => {
    if (activeCategory === 'Wszystkie') return undefined;
    return genres.find((g) => g.name === activeCategory)?.id;
  }, [activeCategory, genres]);

  useEffect(() => {
    if (activeCategory !== 'Wszystkie' && genres.length === 0) return;

    let cancelled = false;
    setLoading(true);

    searchBooks({ genreId: activeGenreId, sort: sort || undefined, page: 0, size: 48 })
      .then((data) => {
        if (cancelled) return;
        setBooks(data.content ?? []);
        setTotal(data.totalElements ?? 0);
      })
      .catch(() => {
        if (!cancelled) setBooks([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [activeGenreId, activeCategory, genres.length, sort]);

  const filteredBooks = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();

    return books.filter((book) => {
      const min = priceMin !== '' ? Number(priceMin) : null;
      const max = priceMax !== '' ? Number(priceMax) : null;
      if (min !== null && book.price < min) return false;
      if (max !== null && book.price > max) return false;

      if (selectedYear && !matchesYearRange(book.publicationYear, selectedYear)) return false;

      if (q) {
        const titleMatch = book.title.toLowerCase().includes(q);
        const authorMatch = book.author.toLowerCase().includes(q);
        if (!titleMatch && !authorMatch) return false;
      }

      if (selectedGenres.length > 0) {
        const bookGenres = book.genres ?? [];
        if (!selectedGenres.some((g) => bookGenres.includes(g))) return false;
      }

      return true;
    });
  }, [books, priceMin, priceMax, selectedYear, debouncedSearch, selectedGenres]);

  return (
    <>
      <Content>
        <FilterPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priceMin={priceMin}
          priceMax={priceMax}
          onPriceMinChange={setPriceMin}
          onPriceMaxChange={setPriceMax}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          genres={genreNames}
          selectedGenres={selectedGenres}
          onGenresChange={setSelectedGenres}
        />

        <BookArea>
          <TopBar>
            <Count>
              Znaleziono {filteredBooks.length}
              {filteredBooks.length !== total ? ` z ${total}` : ''} książek
            </Count>
            <SortRow>
              <SortLabel>Sortuj:</SortLabel>
              <SortSelect value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </SortSelect>
            </SortRow>
          </TopBar>

          {loading && <Message>Ładowanie...</Message>}

          {!loading && filteredBooks.length === 0 && (
            <Message>Nie znaleziono żadnych książek.</Message>
          )}

          {!loading && filteredBooks.length > 0 && (
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
          )}
        </BookArea>
      </Content>
    </>
  );
}
