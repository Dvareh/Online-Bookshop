'use client';

import { useEffect } from 'react';
import styled from 'styled-components';
import BookCard from './BookCard';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchBooks } from '@/store/slices/booksSlice';

const Wrapper = styled.div`
  flex: 1;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Count = styled.p`
  font-size: 14px;
  color: #9a8a7a;
  margin: 0;
`;

const SortRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
`;

export default function BookGrid() {
  const dispatch = useAppDispatch();
  const { items, total, status, error } = useAppSelector((s) => s.books);

  useEffect(() => {
    dispatch(fetchBooks({ page: 0, size: 12 }));
  }, [dispatch]);

  return (
    <Wrapper>
      <TopBar>
        <Count>Znaleziono {total} książek</Count>
        <SortRow>
          <SortLabel>Sortuj:</SortLabel>
          <SortSelect>
            <option>Nazwa</option>
            <option>Cena rosnąco</option>
            <option>Cena malejąco</option>
          </SortSelect>
        </SortRow>
      </TopBar>

      {status === 'loading' && <Message>Ładowanie...</Message>}
      {status === 'failed' && <Message>Błąd: {error}</Message>}
      {status === 'succeeded' && (
        <Grid>
          {items.map((book) => (
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
    </Wrapper>
  );
}
