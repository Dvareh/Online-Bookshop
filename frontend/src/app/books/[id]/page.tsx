'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { ArrowLeft, ShoppingCart, Check, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getBookById, searchBooks } from '@/api';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/slices/cartSlice';
import type { Book } from '@/store/slices/booksSlice';

const Page = styled.div`
  min-height: 100vh;
  background: #f5f0ea;
`;

const Content = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 40px 64px;

  @media (max-width: 768px) {
    padding: 24px 20px 48px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #7a6248;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 32px;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    color: #5e4a36;
  }
`;

const BookLayout = styled.div`
  display: flex;
  gap: 56px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const LeftColumn = styled.div`
  flex-shrink: 0;
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }
`;

const MainCoverWrap = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14);
`;

const CoverImg = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
`;

const CoverPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background: #ede8e2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0a090;
  font-size: 14px;
`;

const ThumbRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const Thumb = styled.div<{ $active?: boolean }>`
  width: 60px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid ${(p) => (p.$active ? '#7a6248' : 'transparent')};
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

const BadgesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const GenreBadge = styled.span`
  display: inline-block;
  padding: 4px 14px;
  background: #e8e3dc;
  border-radius: 20px;
  font-size: 13px;
  color: #5a4a3a;
`;

const BookTitle = styled.h1`
  font-family: 'Lora', 'Georgia', serif;
  font-size: 30px;
  font-weight: 700;
  color: #3d2f1e;
  margin: 0 0 8px;
  line-height: 1.3;
`;

const AuthorName = styled.p`
  font-size: 17px;
  color: #7a6248;
  margin: 0 0 20px;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const StarsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const RatingScore = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #5a4a3a;
`;

const DetailsTable = styled.div`
  display: flex;
  flex-direction: column;
  background: #faf7f3;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8e3dc;
  margin-bottom: 28px;
`;

const DetailsRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #e8e3dc;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailsLabel = styled.span`
  font-size: 14px;
  color: #9a8a7a;
  width: 140px;
  flex-shrink: 0;
`;

const DetailsValue = styled.span`
  font-size: 14px;
  color: #3d2f1e;
  font-weight: 500;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
`;

const PriceLabel = styled.span`
  font-size: 14px;
  color: #9a8a7a;
`;

const Price = styled.span`
  font-family: 'Lora', 'Georgia', serif;
  font-size: 34px;
  font-weight: 700;
  color: #7a6248;
`;

const AddToCartBtn = styled.button<{ $added?: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${(p) => (p.$added ? '#5e8a4a' : '#7a6248')};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;

  &:hover {
    background: ${(p) => (p.$added ? '#4a7a3a' : '#5e4a36')};
  }

  &:active {
    transform: scale(0.99);
  }
`;

const DescriptionBox = styled.div`
  background: #faf7f3;
  border-radius: 10px;
  border: 1px solid #e8e3dc;
  overflow: hidden;
`;

const DescHeader = styled.div`
  padding: 12px 20px;
  background: #f0ebe3;
  border-bottom: 1px solid #e8e3dc;
  font-size: 13px;
  font-weight: 600;
  color: #7a6248;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const DescText = styled.p`
  padding: 18px 20px;
  font-size: 15px;
  color: #5a4a3a;
  line-height: 1.75;
  margin: 0;
`;

const SimilarSection = styled.section`
  margin-top: 56px;
`;

const SectionTitle = styled.h2`
  font-family: 'Lora', 'Georgia', serif;
  font-size: 22px;
  color: #3d2f1e;
  margin: 0 0 20px;
`;

const SimilarRow = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 12px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #e8e3dc;
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: #a89880;
    border-radius: 2px;
  }
`;

const SimilarCard = styled.div`
  width: 150px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8e3dc;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const SimilarCoverImg = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
`;

const SimilarCoverPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background: #ede8e2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0a090;
  font-size: 12px;
`;

const SimilarInfo = styled.div`
  padding: 10px 12px;
`;

const SimilarTitle = styled.p`
  font-family: 'Georgia', serif;
  font-size: 13px;
  color: #3d2f1e;
  margin: 0 0 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SimilarPrice = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #7a6248;
  margin: 0;
`;

const Message = styled.p`
  font-size: 14px;
  color: #9a8a7a;
  text-align: center;
  padding: 60px 0;
`;

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const rawId = params?.id as string;
  const id = /^\d+$/.test(rawId) ? Number(rawId) : NaN;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError('Nieprawidłowe ID książki.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setImgFailed(false);

    getBookById(id)
      .then((data: Book) => {
        setBook(data);

        const genreId = data.genreIds?.[0];
        searchBooks({ genreId, page: 0, size: 10 })
          .then((res) => {
            const others = (res.content ?? [] as Book[]).filter((b: Book) => b.id !== data.id);
            setSimilarBooks(others.slice(0, 6));
          })
          .catch(() => {});
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;
    dispatch(addToCart({ id: book.id, title: book.title, author: book.author, price: book.price, coverUrl: book.coverUrl }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Page>
      <Navbar />
      <Content>
        <BackButton onClick={() => router.back()}><ArrowLeft size={16} /> Powrót</BackButton>

        {loading && <Message>Ładowanie...</Message>}
        {!loading && error && <Message>Błąd: {error}</Message>}

        {!loading && !error && book && (
          <>
            <BookLayout>
              <LeftColumn>
                <MainCoverWrap>
                  {book.coverUrl && !imgFailed ? (
                    <CoverImg
                      src={book.coverUrl}
                      alt={book.title}
                      onError={() => setImgFailed(true)}
                    />
                  ) : (
                    <CoverPlaceholder>Brak okładki</CoverPlaceholder>
                  )}
                </MainCoverWrap>

                {book.coverUrl && !imgFailed && (
                  <ThumbRow>
                    <Thumb $active>
                      <img src={book.coverUrl} alt={book.title} />
                    </Thumb>
                  </ThumbRow>
                )}
              </LeftColumn>

              <RightColumn>
                {book.genres && book.genres.length > 0 && (
                  <BadgesRow>
                    {book.genres.map((g) => (
                      <GenreBadge key={g}>{g}</GenreBadge>
                    ))}
                  </BadgesRow>
                )}

                <BookTitle>{book.title}</BookTitle>
                <AuthorName>{book.author}</AuthorName>

                {book.rating !== undefined && (
                  <RatingRow>
                    <StarsRow>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={18}
                          color="#c8a96e"
                          fill={i < Math.round(book.rating!) ? '#c8a96e' : 'none'}
                        />
                      ))}
                    </StarsRow>
                    <RatingScore>{book.rating.toFixed(1)} / 5.0</RatingScore>
                  </RatingRow>
                )}

                <DetailsTable>
                  {book.publicationYear && (
                    <DetailsRow>
                      <DetailsLabel>Rok wydania</DetailsLabel>
                      <DetailsValue>{book.publicationYear}</DetailsValue>
                    </DetailsRow>
                  )}
                  {book.isbn && (
                    <DetailsRow>
                      <DetailsLabel>ISBN</DetailsLabel>
                      <DetailsValue>{book.isbn}</DetailsValue>
                    </DetailsRow>
                  )}
                  {book.stockQuantity !== undefined && (
                    <DetailsRow>
                      <DetailsLabel>Dostępność</DetailsLabel>
                      <DetailsValue>
                        {book.stockQuantity > 0
                          ? `${book.stockQuantity} szt. w magazynie`
                          : 'Brak w magazynie'}
                      </DetailsValue>
                    </DetailsRow>
                  )}
                </DetailsTable>

                <PriceRow>
                  <PriceLabel>Cena:</PriceLabel>
                  <Price>{book.price} zł</Price>
                </PriceRow>

                <AddToCartBtn $added={added} onClick={handleAddToCart}>
                  {added ? <><Check size={18} /> Dodano do koszyka</> : <><ShoppingCart size={18} /> Dodaj do koszyka</>}
                </AddToCartBtn>

                {book.description && (
                  <DescriptionBox>
                    <DescHeader>Opis</DescHeader>
                    <DescText>{book.description}</DescText>
                  </DescriptionBox>
                )}
              </RightColumn>
            </BookLayout>

            {similarBooks.length > 0 && (
              <SimilarSection>
                <SectionTitle>Podobne książki</SectionTitle>
                <SimilarRow>
                  {similarBooks.map((sb) => (
                    <Link
                      key={sb.id}
                      href={`/books/${sb.id}`}
                      style={{ textDecoration: 'none', flexShrink: 0, display: 'block' }}
                    >
                      <SimilarCard>
                        {sb.coverUrl ? (
                          <SimilarCoverImg src={sb.coverUrl} alt={sb.title} />
                        ) : (
                          <SimilarCoverPlaceholder>Brak</SimilarCoverPlaceholder>
                        )}
                        <SimilarInfo>
                          <SimilarTitle>{sb.title}</SimilarTitle>
                          <SimilarPrice>{sb.price} zł</SimilarPrice>
                        </SimilarInfo>
                      </SimilarCard>
                    </Link>
                  ))}
                </SimilarRow>
              </SimilarSection>
            )}
          </>
        )}
      </Content>
    </Page>
  );
}
