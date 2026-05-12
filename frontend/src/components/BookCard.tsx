'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { ShoppingCart } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/slices/cartSlice';

const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e8e3dc;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background: #ede8e2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0a090;
  font-size: 13px;
`;

const CoverImg = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
`;

const Info = styled.div`
  padding: 12px 14px;
`;

const BookTitle = styled.h4`
  font-family: 'Georgia', serif;
  font-size: 15px;
  color: #3d2f1e;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Author = styled.p`
  font-size: 13px;
  color: #9a8a7a;
  margin: 0 0 4px 0;
`;

const Genre = styled.p`
  font-size: 12px;
  color: #b0a090;
  margin: 0 0 10px 0;
  font-style: italic;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Price = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #7a6248;
`;

const CartButton = styled.button`
  width: 34px;
  height: 34px;
  background: #7a6248;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #5e4a36;
  }
`;

interface Props {
  id?: number;
  title: string;
  author: string;
  price: number;
  genres?: string[];
  coverUrl?: string;
}

export default function BookCard({ id, title, author, price, genres, coverUrl }: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const dispatch = useAppDispatch();

  const content = (
    <Card>
      {coverUrl && !imgFailed ? (
        <CoverImg src={coverUrl} alt={title} onError={() => setImgFailed(true)} />
      ) : (
        <ImagePlaceholder>Brak okładki</ImagePlaceholder>
      )}
      <Info>
        <BookTitle>{title}</BookTitle>
        <Author>{author}</Author>
        {genres && genres.length > 0 && <Genre>{genres.join(', ')}</Genre>}
        <Bottom>
          <Price>{price} zł</Price>
          <CartButton
            onClick={(e) => {
              e.preventDefault();
              if (id !== undefined) {
                dispatch(addToCart({ id, title, author, price, coverUrl }));
              }
            }}
          >
            <ShoppingCart size={16} />
          </CartButton>
        </Bottom>
      </Info>
    </Card>
  );

  if (id !== undefined) {
    return (
      <Link href={`/books/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
        {content}
      </Link>
    );
  }

  return content;
}
