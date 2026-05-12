'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Navbar from '@/components/Navbar';
import { useAppSelector, useAppDispatch } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import { logout } from '@/store/slices/authSlice';
import { createOrder, getStoredToken } from '@/api';

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

const PageTitle = styled.h1`
  font-family: 'Lora', 'Georgia', serif;
  font-size: 26px;
  font-weight: 700;
  color: #3d2f1e;
  margin: 0 0 28px;
`;

const CheckoutLayout = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const FormsColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e3dc;
  box-shadow: 0 2px 12px rgba(61, 47, 30, 0.06);
  padding: 24px;
`;

const CardTitle = styled.h2`
  font-family: 'Lora', 'Georgia', serif;
  font-size: 16px;
  font-weight: 700;
  color: #3d2f1e;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TitleIcon = styled.span`
  font-size: 16px;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const FieldWrap = styled.div<{ $full?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  ${(p) => p.$full && 'margin-bottom: 14px;'}
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #7a6248;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  font-size: 14px;
  pointer-events: none;
  opacity: 0.6;
`;

const Input = styled.input<{ $hasIcon?: boolean; $error?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  padding: ${(p) => (p.$hasIcon ? '11px 12px 11px 34px' : '11px 14px')};
  border: 1px solid ${(p) => (p.$error ? '#c0392b' : '#d8d0c8')};
  border-radius: 8px;
  font-size: 14px;
  color: #3d2f1e;
  background: #fff;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder {
    color: #b8aea4;
  }

  &:focus {
    border-color: ${(p) => (p.$error ? '#c0392b' : '#7a6248')};
  }
`;

const ErrorMsg = styled.span`
  font-size: 11px;
  color: #c0392b;
`;

const PaymentOption = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid ${(p) => (p.$selected ? '#7a6248' : '#e0d9d0')};
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 10px;
  background: ${(p) => (p.$selected ? '#faf7f3' : '#fff')};
  transition: border-color 0.15s, background 0.15s;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    border-color: #7a6248;
  }
`;

const RadioDot = styled.span<{ $selected: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${(p) => (p.$selected ? '#7a6248' : '#c8bfb4')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s;

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(p) => (p.$selected ? '#7a6248' : 'transparent')};
    transition: background 0.15s;
  }
`;

const PaymentLabel = styled.span`
  font-size: 14px;
  color: #3d2f1e;
  font-weight: 500;
`;

const PaymentIcon = styled.span`
  font-size: 16px;
  margin-left: auto;
`;

const SidebarColumn = styled.div`
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;

  @media (max-width: 960px) {
    width: 100%;
    position: static;
  }
`;

const SidebarCard = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e3dc;
  box-shadow: 0 2px 12px rgba(61, 47, 30, 0.06);
  padding: 24px;
`;

const SidebarTitle = styled.h2`
  font-family: 'Lora', 'Georgia', serif;
  font-size: 16px;
  font-weight: 700;
  color: #3d2f1e;
  margin: 0 0 16px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const OrderThumb = styled.div`
  flex-shrink: 0;
  width: 44px;
  height: 58px;
  border-radius: 4px;
  overflow: hidden;
  background: #ede8e2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OrderThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const OrderThumbPlaceholder = styled.span`
  font-size: 18px;
  opacity: 0.4;
`;

const OrderItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const OrderItemTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #3d2f1e;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OrderItemMeta = styled.p`
  font-size: 12px;
  color: #9a8a7a;
  margin: 0;
`;

const OrderItemPrice = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #3d2f1e;
  flex-shrink: 0;
`;

const SidebarDivider = styled.hr`
  border: none;
  border-top: 1px solid #e8e3dc;
  margin: 14px 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SummaryLabel = styled.span`
  font-size: 13px;
  color: #7a6248;
`;

const SummaryValue = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #3d2f1e;
`;

const FreeShipping = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #5e8a4a;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
`;

const TotalLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #3d2f1e;
`;

const TotalValue = styled.span`
  font-family: 'Lora', 'Georgia', serif;
  font-size: 24px;
  font-weight: 700;
  color: #7a6248;
`;

const VatNote = styled.p`
  font-size: 11px;
  color: #b0a090;
  text-align: right;
  margin: 0 0 18px;
`;

const PlaceOrderBtn = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 14px;
  background: ${(p) => (p.$loading ? '#a08a70' : '#7a6248')};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${(p) => (p.$loading ? 'not-allowed' : 'pointer')};
  transition: background 0.2s;
  margin-bottom: 10px;

  &:hover:not(:disabled) {
    background: #5e4a36;
  }
`;

const FinePrint = styled.p`
  font-size: 11px;
  color: #b0a090;
  text-align: center;
  margin: 0;
  line-height: 1.5;
`;

const OrderErrorMsg = styled.p`
  font-size: 13px;
  color: #c0392b;
  text-align: center;
  margin: 0 0 12px;
`;

type PaymentMethod = 'card' | 'blik' | 'transfer' | 'cod';

interface FieldProps {
  label: string;
  value: string;
  placeholder?: string;
  icon?: string;
  error?: string;
  onChange: (v: string) => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'card', label: 'Karta płatnicza', icon: '💳' },
  { value: 'blik', label: 'BLIK', icon: '📱' },
  { value: 'transfer', label: 'Przelew bankowy', icon: '🏦' },
  { value: 'cod', label: 'Płatność przy odbiorze', icon: '📦' },
];

function formatPostalCode(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 5);
  return digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits;
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const items = useAppSelector((s) => s.cart.items);

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Polska',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [payment, setPayment] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) setForm((prev) => ({ ...prev, email: user.email }));
  }, [user]);

  useEffect(() => {
    if (!loading && items.length === 0) {
      router.replace('/cart');
    }
  }, [items, loading, router]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const setField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = 'Wymagane';
    if (!form.lastName.trim()) e.lastName = 'Wymagane';
    if (!form.email.trim()) e.email = 'Wymagane';
    if (!form.street.trim()) e.street = 'Wymagane';
    if (!form.city.trim()) e.city = 'Wymagane';
    if (form.postalCode.length < 6) e.postalCode = 'Format: 00-000';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (!getStoredToken()) {
      dispatch(logout());
      setOrderError('Sesja wygasła. Zaloguj się ponownie, aby złożyć zamówienie.');
      return;
    }

    setLoading(true);
    setOrderError(null);

    try {
      await createOrder({
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone || undefined,
          street: form.street,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: payment,
        items: items.map((i) => ({ bookId: i.id, quantity: i.quantity, price: i.price })),
        total: subtotal,
      });
      dispatch(clearCart());
      router.push('/profile');
    } catch (err: unknown) {
      setOrderError(err instanceof Error ? err.message : 'Błąd składania zamówienia.');
      setLoading(false);
    }
  };

  return (
    <Page>
      <Navbar />
      <Content>
        <PageTitle>Kasa</PageTitle>

        <CheckoutLayout>
          <FormsColumn>
            <Card>
              <CardTitle>
                <TitleIcon>👤</TitleIcon>
                Dane kontaktowe
              </CardTitle>

              <FieldRow>
                <Field
                  label="Imię"
                  value={form.firstName}
                  placeholder="Jan"
                  error={errors.firstName}
                  onChange={(v) => setField('firstName', v)}
                />
                <Field
                  label="Nazwisko"
                  value={form.lastName}
                  placeholder="Kowalski"
                  error={errors.lastName}
                  onChange={(v) => setField('lastName', v)}
                />
              </FieldRow>

              <FieldRow>
                <Field
                  label="Email"
                  value={form.email}
                  placeholder="jan@example.com"
                  icon="✉"
                  error={errors.email}
                  onChange={(v) => setField('email', v)}
                />
                <Field
                  label="Telefon"
                  value={form.phone}
                  placeholder="+48 000 000 000"
                  icon="📞"
                  onChange={(v) => setField('phone', v)}
                />
              </FieldRow>
            </Card>

            <Card>
              <CardTitle>
                <TitleIcon>📍</TitleIcon>
                Adres dostawy
              </CardTitle>

              <FieldWrap $full>
                <Label>Ulica i numer</Label>
                <InputWrap>
                  <Input
                    value={form.street}
                    placeholder="ul. Przykładowa 1/2"
                    $error={!!errors.street}
                    onChange={(e) => setField('street', e.target.value)}
                  />
                </InputWrap>
                {errors.street && <ErrorMsg>{errors.street}</ErrorMsg>}
              </FieldWrap>

              <FieldRow>
                <Field
                  label="Miasto"
                  value={form.city}
                  placeholder="Warszawa"
                  error={errors.city}
                  onChange={(v) => setField('city', v)}
                />
                <FieldWrap>
                  <Label>Kod pocztowy</Label>
                  <InputWrap>
                    <Input
                      value={form.postalCode}
                      placeholder="00-000"
                      $error={!!errors.postalCode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setField('postalCode', formatPostalCode(e.target.value))
                      }
                    />
                  </InputWrap>
                  {errors.postalCode && <ErrorMsg>{errors.postalCode}</ErrorMsg>}
                </FieldWrap>
              </FieldRow>

              <FieldWrap $full>
                <Label>Kraj</Label>
                <InputWrap>
                  <Input
                    value={form.country}
                    onChange={(e) => setField('country', e.target.value)}
                  />
                </InputWrap>
              </FieldWrap>
            </Card>

            <Card>
              <CardTitle>
                <TitleIcon>💳</TitleIcon>
                Metoda płatności
              </CardTitle>

              {PAYMENT_OPTIONS.map((opt) => (
                <PaymentOption
                  key={opt.value}
                  $selected={payment === opt.value}
                  onClick={() => setPayment(opt.value)}
                >
                  <RadioDot $selected={payment === opt.value} />
                  <PaymentLabel>{opt.label}</PaymentLabel>
                  <PaymentIcon>{opt.icon}</PaymentIcon>
                </PaymentOption>
              ))}
            </Card>
          </FormsColumn>

          <SidebarColumn>
            <SidebarCard>
              <SidebarTitle>Podsumowanie zamówienia</SidebarTitle>

              {items.map((item) => (
                <OrderItem key={item.id}>
                  <OrderThumb>
                    {item.coverUrl ? (
                      <OrderThumbImg src={item.coverUrl} alt={item.title} />
                    ) : (
                      <OrderThumbPlaceholder>📖</OrderThumbPlaceholder>
                    )}
                  </OrderThumb>
                  <OrderItemInfo>
                    <OrderItemTitle>{item.title}</OrderItemTitle>
                    <OrderItemMeta>
                      {item.quantity} × {item.price.toFixed(2)} zł
                    </OrderItemMeta>
                  </OrderItemInfo>
                  <OrderItemPrice>
                    {(item.price * item.quantity).toFixed(2)} zł
                  </OrderItemPrice>
                </OrderItem>
              ))}

              <SidebarDivider />

              <SummaryRow>
                <SummaryLabel>Produkty</SummaryLabel>
                <SummaryValue>{subtotal.toFixed(2)} zł</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>Dostawa</SummaryLabel>
                <FreeShipping>Darmowa</FreeShipping>
              </SummaryRow>

              <SidebarDivider />

              <TotalRow>
                <TotalLabel>Łącznie</TotalLabel>
                <TotalValue>{subtotal.toFixed(2)} zł</TotalValue>
              </TotalRow>
              <VatNote>Cena zawiera podatek VAT</VatNote>

              {orderError && <OrderErrorMsg>{orderError}</OrderErrorMsg>}
              <PlaceOrderBtn $loading={loading} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Przetwarzanie...' : 'Złóż zamówienie'}
              </PlaceOrderBtn>

              <FinePrint>
                Składając zamówienie akceptujesz regulamin sklepu.
              </FinePrint>
            </SidebarCard>
          </SidebarColumn>
        </CheckoutLayout>
      </Content>
    </Page>
  );
}

function Field({ label, value, placeholder, icon, error, onChange }: FieldProps) {
  return (
    <FieldWrap>
      <Label>{label}</Label>
      <InputWrap>
        {icon && <InputIcon>{icon}</InputIcon>}
        <Input
          value={value}
          placeholder={placeholder}
          $hasIcon={!!icon}
          $error={!!error}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
      </InputWrap>
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </FieldWrap>
  );
}
