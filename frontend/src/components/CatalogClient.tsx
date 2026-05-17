'use client';

import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FilterPanel from './FilterPanel';
import BookCard from './BookCard';
import { searchBooks, getGenres } from '@/api';
import type { Genre } from '@/api';
import type { Book } from '@/store/slices/booksSlice';

const PAGE_SIZE = 12;

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

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 32px;
  flex-wrap: wrap;
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid ${p => p.$active ? '#7a6248' : '#d8d0c8'};
  background: ${p => p.$active ? '#7a6248' : '#fff'};
  color: ${p => p.$active ? '#fff' : '#3d2f1e'};
  font-size: 13px;
  font-weight: ${p => p.$active ? '600' : '400'};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: background 0.15s, border-color 0.15s;

  &:hover:not(:disabled):not([data-active='true']) {
    border-color: #7a6248;
    background: #faf7f3;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const PageEllipsis = styled.span`
  font-size: 13px;
  color: #9a8a7a;
  padding: 0 4px;
  line-height: 36px;
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

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages: (number | '...')[] = [0];

  const rangeStart = Math.max(1, current - 1);
  const rangeEnd = Math.min(total - 2, current + 1);

  if (rangeStart > 1) pages.push('...');
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
  if (rangeEnd < total - 2) pages.push('...');

  pages.push(total - 1);
  return pages;
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
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
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

  // Reset to page 0 whenever filters or sort change
  useEffect(() => {
    setPage(0);
  }, [activeGenreId, sort, debouncedSearch]);

  // Fetch from backend
  useEffect(() => {
    if (activeCategory !== 'Wszystkie' && genres.length === 0) return;

    let cancelled = false;
    setLoading(true);

    searchBooks({
      genreId: activeGenreId,
      sort: sort || undefined,
      title: debouncedSearch || undefined,
      page,
      size: PAGE_SIZE,
    })
      .then((data) => {
        if (cancelled) return;
        setBooks(data.content ?? []);
        setTotalElements(data.totalElements ?? 0);
        setTotalPages(data.totalPages ?? 0);
      })
      .catch(() => {
        if (!cancelled) setBooks([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [activeGenreId, activeCategory, genres.length, sort, debouncedSearch, page]);

  // Client-side filters applied to the current page results
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

  const pageNumbers = buildPageNumbers(page, totalPages);

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
              {totalElements > 0
                ? `Znaleziono ${totalElements} książek${filteredBooks.length < books.length ? ` (${filteredBooks.length} na tej stronie po filtrach)` : ''}`
                : 'Brak wyników'}
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

          {!loading && totalPages > 1 && (
            <PaginationRow>
              <PageBtn
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
              >
                <ChevronLeft size={15} /> 
              </PageBtn>

              {pageNumbers.map((p, i) =>
                p === '...' ? (
                  <PageEllipsis key={`e${i}`}>…</PageEllipsis>
                ) : (
                  <PageBtn
                    key={p}
                    $active={p === page}
                    onClick={() => setPage(p as number)}
                  >
                    {(p as number) + 1}
                  </PageBtn>
                )
              )}

              <PageBtn
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
              >
                 <ChevronRight size={15} />
              </PageBtn>
            </PaginationRow>
          )}
        </BookArea>
      </Content>
    </>
  );
}
