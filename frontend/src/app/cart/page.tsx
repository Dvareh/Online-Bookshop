'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { ShoppingCart, BookOpen, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAppDispatch, useAppSelector } from '@/store';
import { removeFromCart, updateQuantity } from '@/store/slices/cartSlice';

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

const PageHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-family: 'Lora', 'Georgia', serif;
  font-size: 26px;
  font-weight: 700;
  color: #3d2f1e;
  margin: 0;
`;

const ItemCountLabel = styled.span`
  font-size: 15px;
  color: #9a8a7a;
`;

const CartLayout = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const ItemsColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemsCard = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e3dc;
  box-shadow: 0 2px 12px rgba(61, 47, 30, 0.06);
  overflow: hidden;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #f0ebe3;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 560px) {
    flex-wrap: wrap;
  }
`;

const ItemThumb = styled.div`
  flex-shrink: 0;
  width: 60px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  background: #ede8e2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ThumbPlaceholder = styled.span`
  display: inline-flex;
  opacity: 0.5;
  color: #7a6248;
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemTitle = styled.p`
  font-family: 'Lora', 'Georgia', serif;
  font-size: 15px;
  font-weight: 600;
  color: #3d2f1e;
  margin: 0 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemAuthor = styled.p`
  font-size: 13px;
  color: #9a8a7a;
  margin: 0 0 6px;
`;

const ItemUnitPrice = styled.p`
  font-size: 13px;
  color: #7a6248;
  margin: 0;
`;

const ItemRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  flex-shrink: 0;
`;

const ItemTotalPrice = styled.span`
  font-size: 17px;
  font-weight: 700;
  color: #c0392b;
`;

const StepperRow = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e0d9d0;
  border-radius: 8px;
  overflow: hidden;
`;

const StepperBtn = styled.button`
  width: 32px;
  height: 32px;
  background: #faf7f3;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #5a4a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover {
    background: #ede8e2;
  }
`;

const StepperValue = styled.span`
  min-width: 36px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #3d2f1e;
  border-left: 1px solid #e0d9d0;
  border-right: 1px solid #e0d9d0;
  height: 32px;
  line-height: 32px;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #c0392b;
  padding: 2px 4px;
  opacity: 0.65;
  transition: opacity 0.15s;
  display: inline-flex;
  align-items: center;

  &:hover {
    opacity: 1;
  }
`;

const SummaryColumn = styled.div`
  width: 300px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;

  @media (max-width: 900px) {
    width: 100%;
    position: static;
  }
`;

const SummaryCard = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e3dc;
  box-shadow: 0 2px 12px rgba(61, 47, 30, 0.06);
  padding: 24px;
`;

const SummaryTitle = styled.h2`
  font-family: 'Lora', 'Georgia', serif;
  font-size: 18px;
  font-weight: 700;
  color: #3d2f1e;
  margin: 0 0 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SummaryLabel = styled.span`
  font-size: 14px;
  color: #7a6248;
`;

const SummaryValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #3d2f1e;
`;

const FreeShipping = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #5e8a4a;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e8e3dc;
  margin: 16px 0;
`;

const TotalRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const TotalLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #3d2f1e;
`;

const TotalValue = styled.span`
  font-family: 'Lora', 'Georgia', serif;
  font-size: 26px;
  font-weight: 700;
  color: #c0392b;
`;

const VatNote = styled.p`
  font-size: 12px;
  color: #b0a090;
  text-align: right;
  margin: 0 0 20px;
`;

const CheckoutBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #7a6248;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 10px;

  &:hover {
    background: #5e4a36;
  }
`;

const ContinueBtn = styled.button`
  width: 100%;
  padding: 13px;
  background: transparent;
  color: #7a6248;
  border: 1px solid #c8bfb4;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;

  &:hover {
    border-color: #7a6248;
    color: #5e4a36;
  }
`;

const EmptyWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  display: flex;
  margin-bottom: 20px;
  opacity: 0.45;
  color: #7a6248;
`;

const EmptyTitle = styled.h2`
  font-family: 'Lora', 'Georgia', serif;
  font-size: 22px;
  color: #3d2f1e;
  margin: 0 0 10px;
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: #9a8a7a;
  margin: 0 0 28px;
  max-width: 360px;
  line-height: 1.6;
`;

const EmptyBtn = styled.button`
  padding: 13px 32px;
  background: #7a6248;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5e4a36;
  }
`;

function pluralItems(n: number): string {
  if (n === 1) return '1 produkt';
  if (n >= 2 && n <= 4) return `${n} produkty`;
  return `${n} produktów`;
}

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const decrement = (id: number, qty: number) => {
    if (qty <= 1) dispatch(removeFromCart(id));
    else dispatch(updateQuantity({ id, quantity: qty - 1 }));
  };

  const increment = (id: number, qty: number) =>
    dispatch(updateQuantity({ id, quantity: qty + 1 }));

  return (
    <Page>
      <Navbar />
      <Content>
        <PageHeader>
          <PageTitle>Koszyk</PageTitle>
          {items.length > 0 && (
            <ItemCountLabel>({pluralItems(totalItems)})</ItemCountLabel>
          )}
        </PageHeader>

        {items.length === 0 ? (
          <EmptyWrap>
            <EmptyIcon><ShoppingCart size={64} /></EmptyIcon>
            <EmptyTitle>Twój koszyk jest pusty</EmptyTitle>
            <EmptyText>
              Dodaj książki do koszyka, aby kontynuować zakupy.
            </EmptyText>
            <EmptyBtn onClick={() => router.push('/')}>
              Kontynuj zakupy
            </EmptyBtn>
          </EmptyWrap>
        ) : (
          <CartLayout>
            <ItemsColumn>
              <ItemsCard>
                {items.map((item) => (
                  <CartItem key={item.id}>
                    <ItemThumb>
                      {item.coverUrl ? (
                        <ThumbImg src={item.coverUrl} alt={item.title} />
                      ) : (
                        <ThumbPlaceholder><BookOpen size={22} /></ThumbPlaceholder>
                      )}
                    </ItemThumb>

                    <ItemInfo>
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemAuthor>{item.author}</ItemAuthor>
                      <ItemUnitPrice>{item.price.toFixed(2)} zł / szt.</ItemUnitPrice>
                    </ItemInfo>

                    <ItemRight>
                      <ItemTotalPrice>
                        {(item.price * item.quantity).toFixed(2)} zł
                      </ItemTotalPrice>

                      <StepperRow>
                        <StepperBtn
                          onClick={() => decrement(item.id, item.quantity)}
                          aria-label="Zmniejsz ilość"
                        >
                          −
                        </StepperBtn>
                        <StepperValue>{item.quantity}</StepperValue>
                        <StepperBtn
                          onClick={() => increment(item.id, item.quantity)}
                          aria-label="Zwiększ ilość"
                        >
                          +
                        </StepperBtn>
                      </StepperRow>

                      <DeleteBtn
                        onClick={() => dispatch(removeFromCart(item.id))}
                        aria-label="Usuń z koszyka"
                      >
                        <Trash2 size={18} />
                      </DeleteBtn>
                    </ItemRight>
                  </CartItem>
                ))}
              </ItemsCard>
            </ItemsColumn>

            <SummaryColumn>
              <SummaryCard>
                <SummaryTitle>Podsumowanie</SummaryTitle>

                <SummaryRow>
                  <SummaryLabel>Produkty ({totalItems})</SummaryLabel>
                  <SummaryValue>{subtotal.toFixed(2)} zł</SummaryValue>
                </SummaryRow>

                <SummaryRow>
                  <SummaryLabel>Dostawa</SummaryLabel>
                  <FreeShipping>Darmowa</FreeShipping>
                </SummaryRow>

                <Divider />

                <TotalRow>
                  <TotalLabel>Razem</TotalLabel>
                  <TotalValue>{subtotal.toFixed(2)} zł</TotalValue>
                </TotalRow>
                <VatNote>Cena zawiera VAT</VatNote>

                <CheckoutBtn onClick={() => router.push('/checkout')}>Przejdź do kasy →</CheckoutBtn>
                <ContinueBtn onClick={() => router.push('/')}>
                  Kontynuj zakupy
                </ContinueBtn>
              </SummaryCard>
            </SummaryColumn>
          </CartLayout>
        )}
      </Content>
    </Page>
  );
}
