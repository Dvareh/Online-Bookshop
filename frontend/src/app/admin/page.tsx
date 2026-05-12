'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Navbar from '@/components/Navbar';
import { useAppSelector } from '@/store';
import { ShieldOff, BookOpen } from 'lucide-react';
import {
  adminGetOrders, adminUpdateOrderStatus,
  adminGetUsers, adminDeleteUser,
  adminGetBooks, adminAddBook, adminUpdateBook, adminDeleteBook,
  getGenres,
  AdminOrderDTO, UserDTO, BookResponseDTO, BookRequestPayload, Genre,
} from '@/api';

type Tab = 'overview' | 'books' | 'orders' | 'users';

const ORDER_STATUSES = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED'] as const;

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Nowe',
  PROCESSING: 'W realizacji',
  SHIPPED: 'Wysłane',
  DELIVERED: 'Dostarczone',
  CANCELED: 'Anulowane',
};

const emptyBook: BookRequestPayload = {
  title: '',
  author: '',
  description: '',
  coverUrl: '',
  publicationYear: new Date().getFullYear(),
  price: 0,
  stockQuantity: 0,
  genreIds: [],
};

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #f4f1ec;
  font-family: 'Lato', sans-serif;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px 64px;
`;

const PageTitle = styled.h1`
  font-family: 'Lora', Georgia, serif;
  font-size: 24px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0 0 4px;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: #9a9086;
  margin: 0 0 28px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 2px;
  border-bottom: 1px solid #e8e4de;
  margin-bottom: 28px;
`;

const TabBtn = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
  font-weight: ${p => p.$active ? '600' : '400'};
  color: ${p => p.$active ? '#3d2f1e' : '#9a9086'};
  border-bottom: 2px solid ${p => p.$active ? '#7a6248' : 'transparent'};
  margin-bottom: -1px;
  transition: color 0.15s;
  &:hover { color: #3d2f1e; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: #fff;
  border: 1px solid #e8e4de;
  border-radius: 12px;
  padding: 20px 24px;
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: #9a9086;
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.p`
  font-family: 'Lora', Georgia, serif;
  font-size: 28px;
  font-weight: 700;
  color: #3d2f1e;
  margin: 0;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e8e4de;
  border-radius: 12px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0ece6;
`;

const CardTitle = styled.h3`
  font-family: 'Lora', Georgia, serif;
  font-size: 15px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #9a9086;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  background: #faf8f5;
  border-bottom: 1px solid #f0ece6;
`;

const Td = styled.td`
  padding: 12px 16px;
  font-size: 13px;
  color: #3d2f1e;
  border-bottom: 1px solid #f8f5f1;
  vertical-align: middle;
`;

const Tr = styled.tr`
  &:last-child td { border-bottom: none; }
  &:hover td { background: #faf8f5; }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 9px 14px;
  border: 1px solid #d8d0c8;
  border-radius: 8px;
  font-size: 13px;
  color: #3d2f1e;
  background: #fff;
  outline: none;
  &:focus { border-color: #7a6248; }
  &::placeholder { color: #b8aea4; }
`;

const Select = styled.select`
  padding: 9px 14px;
  border: 1px solid #d8d0c8;
  border-radius: 8px;
  font-size: 13px;
  color: #3d2f1e;
  background: #fff;
  outline: none;
  cursor: pointer;
  &:focus { border-color: #7a6248; }
`;

const Btn = styled.button<{ $variant?: 'primary' | 'danger' | 'ghost' }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s, background 0.15s;
  background: ${p =>
    p.$variant === 'danger' ? '#fbeaea' :
    p.$variant === 'ghost' ? '#f0ece6' :
    '#7a6248'};
  color: ${p =>
    p.$variant === 'danger' ? '#b04040' :
    p.$variant === 'ghost' ? '#4a4238' :
    '#fff'};
  &:hover { opacity: 0.85; }
`;

const StatusSelect = styled.select<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  outline: none;
  background: ${p =>
    p.$status === 'DELIVERED' ? '#e8f5ee' :
    p.$status === 'SHIPPED' ? '#eef0fb' :
    p.$status === 'CANCELED' ? '#fbeaea' :
    '#fdf4e3'};
  color: ${p =>
    p.$status === 'DELIVERED' ? '#2d7a4f' :
    p.$status === 'SHIPPED' ? '#5a6bbf' :
    p.$status === 'CANCELED' ? '#b04040' :
    '#b07d2e'};
`;

const EmptyRow = styled.tr``;
const EmptyCell = styled.td`
  padding: 32px;
  text-align: center;
  color: #aaa39b;
  font-size: 14px;
`;

const CoverImg = styled.img`
  width: 36px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  background: #ede8e2;
`;

const CoverPlaceholder = styled.div`
  width: 36px;
  height: 50px;
  border-radius: 4px;
  background: #ede8e2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9a8a7a;
  opacity: 0.5;
`;

const RoleBadge = styled.span<{ $admin: boolean }>`
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  background: ${p => p.$admin ? '#fdf4e3' : '#f0ece6'};
  color: ${p => p.$admin ? '#b07d2e' : '#7a6248'};
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0ece6;
  position: sticky;
  top: 0;
  background: #fff;
`;

const ModalTitle = styled.h2`
  font-family: 'Lora', Georgia, serif;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0;
`;

const ModalBody = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f0ece6;
  position: sticky;
  bottom: 0;
  background: #fff;
`;

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #7a6248;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  display: block;
  margin-bottom: 5px;
`;

const FieldInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border: 1px solid #d8d0c8;
  border-radius: 8px;
  font-size: 13px;
  color: #3d2f1e;
  background: #fff;
  outline: none;
  &:focus { border-color: #7a6248; }
`;

const FieldTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border: 1px solid #d8d0c8;
  border-radius: 8px;
  font-size: 13px;
  color: #3d2f1e;
  background: #fff;
  outline: none;
  resize: vertical;
  min-height: 72px;
  font-family: 'Lato', sans-serif;
  &:focus { border-color: #7a6248; }
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const GenreGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const GenreChip = styled.button<{ $selected: boolean }>`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${p => p.$selected ? '#7a6248' : '#d8d0c8'};
  background: ${p => p.$selected ? '#7a6248' : '#fff'};
  color: ${p => p.$selected ? '#fff' : '#7a6248'};
  cursor: pointer;
  transition: all 0.15s;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #9a9086;
  cursor: pointer;
  padding: 2px;
  line-height: 1;
  &:hover { color: #3d2f1e; }
`;

const ErrorText = styled.p`
  font-size: 13px;
  color: #b04040;
  text-align: center;
  padding: 20px;
  margin: 0;
`;

const LoadingText = styled.p`
  font-size: 13px;
  color: #9a9086;
  text-align: center;
  padding: 20px;
  margin: 0;
`;

const AccessDenied = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #9a9086;
  font-size: 15px;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const { user, token, initializing } = useAppSelector(s => s.auth);

  const [tab, setTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [orders, setOrders] = useState<AdminOrderDTO[]>([]);
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [books, setBooks] = useState<BookResponseDTO[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<BookResponseDTO | null>(null);
  const [bookForm, setBookForm] = useState<BookRequestPayload>(emptyBook);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === 'ROLE_ADMIN';

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [o, u, b, g] = await Promise.all([
        adminGetOrders(),
        adminGetUsers(),
        adminGetBooks(),
        getGenres(),
      ]);
      setOrders(o);
      setUsers(u);
      setBooks(b);
      setGenres(g);
    } catch {
      setError('Błąd ładowania danych.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initializing && !token) router.replace('/login');
  }, [initializing, token, router]);

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin, loadData]);

  if (initializing || !token) return null;

  if (!isAdmin) {
    return (
      <Page>
        <Navbar />
        <AccessDenied>
          <ShieldOff size={48} color="#c8bfb4" />
          <p>Dostęp tylko dla administratorów.</p>
        </AccessDenied>
      </Page>
    );
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice ?? 0), 0);

  // ── Order handlers ─────────────────────────────────────────────────────────
  const handleStatusChange = async (id: number, status: string) => {
    try {
      const updated = await adminUpdateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
    } catch {
      alert('Błąd aktualizacji statusu.');
    }
  };

  // ── User handlers ──────────────────────────────────────────────────────────
  const handleDeleteUser = async (id: number) => {
    if (!confirm('Usunąć użytkownika?')) return;
    try {
      await adminDeleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      alert('Błąd usuwania użytkownika.');
    }
  };

  // ── Book handlers ──────────────────────────────────────────────────────────
  const openAddBook = () => {
    setEditingBook(null);
    setBookForm(emptyBook);
    setShowBookModal(true);
  };

  const openEditBook = (book: BookResponseDTO) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description ?? '',
      coverUrl: book.coverUrl ?? '',
      publicationYear: book.publicationYear,
      price: book.price,
      stockQuantity: book.stockQuantity,
      genreIds: genres.filter(g => book.genres?.includes(g.name)).map(g => g.id),
    });
    setShowBookModal(true);
  };

  const handleDeleteBook = async (id: number) => {
    if (!confirm('Usunąć książkę?')) return;
    try {
      await adminDeleteBook(id);
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch {
      alert('Błąd usuwania książki.');
    }
  };

  const handleSaveBook = async () => {
    setSaving(true);
    try {
      if (editingBook) {
        const updated = await adminUpdateBook(editingBook.id, bookForm);
        setBooks(prev => prev.map(b => b.id === editingBook.id ? updated : b));
      } else {
        const created = await adminAddBook(bookForm);
        setBooks(prev => [...prev, created]);
      }
      setShowBookModal(false);
    } catch {
      alert('Błąd zapisywania książki.');
    } finally {
      setSaving(false);
    }
  };

  const toggleGenre = (id: number) => {
    setBookForm(prev => ({
      ...prev,
      genreIds: prev.genreIds?.includes(id)
        ? prev.genreIds.filter(g => g !== id)
        : [...(prev.genreIds ?? []), id],
    }));
  };

  // ── Filters ────────────────────────────────────────────────────────────────
  const filteredOrders = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = String(o.id).includes(q) || o.userEmail.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredBooks = books.filter(b => {
    const q = search.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
  });

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <Page>
      <Navbar />
      <Container>
        <PageTitle>Panel Administracyjny</PageTitle>
        <PageSub>Zarządzaj książkami, zamówieniami i użytkownikami</PageSub>

        <Tabs>
          {(['overview', 'books', 'orders', 'users'] as Tab[]).map(t => (
            <TabBtn key={t} $active={tab === t} onClick={() => { setTab(t); setSearch(''); setStatusFilter('ALL'); }}>
              {t === 'overview' && 'Przegląd'}
              {t === 'books' && `Książki (${books.length})`}
              {t === 'orders' && `Zamówienia (${orders.length})`}
              {t === 'users' && `Użytkownicy (${users.length})`}
            </TabBtn>
          ))}
        </Tabs>

        {loading && <LoadingText>Ładowanie...</LoadingText>}
        {error && <ErrorText>{error}</ErrorText>}

        {!loading && !error && (
          <>
            {/* ── Overview ─────────────────────────────────────────────────── */}
            {tab === 'overview' && (
              <>
                <StatsGrid>
                  <StatCard>
                    <StatLabel>Książki</StatLabel>
                    <StatValue>{books.length}</StatValue>
                  </StatCard>
                  <StatCard>
                    <StatLabel>Zamówienia</StatLabel>
                    <StatValue>{orders.length}</StatValue>
                  </StatCard>
                  <StatCard>
                    <StatLabel>Przychody</StatLabel>
                    <StatValue>{totalRevenue.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł</StatValue>
                  </StatCard>
                  <StatCard>
                    <StatLabel>Użytkownicy</StatLabel>
                    <StatValue>{users.length}</StatValue>
                  </StatCard>
                </StatsGrid>

                <Card>
                  <CardHeader>
                    <CardTitle>Ostatnie zamówienia</CardTitle>
                  </CardHeader>
                  <Table>
                    <thead>
                      <tr>
                        <Th>ID</Th>
                        <Th>Data</Th>
                        <Th>Klient</Th>
                        <Th>Kwota</Th>
                        <Th>Status</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 8).map(o => (
                        <Tr key={o.id}>
                          <Td>#{o.id}</Td>
                          <Td>{formatDate(o.createdAt)}</Td>
                          <Td>{o.userEmail}</Td>
                          <Td>{(o.totalPrice ?? 0).toFixed(2)} zł</Td>
                          <Td>
                            <StatusSelect
                              $status={o.status}
                              value={o.status}
                              onChange={e => handleStatusChange(o.id, e.target.value)}
                            >
                              {ORDER_STATUSES.map(s => (
                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                              ))}
                            </StatusSelect>
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </>
            )}

            {/* ── Books ────────────────────────────────────────────────────── */}
            {tab === 'books' && (
              <>
                <Toolbar>
                  <SearchInput
                    placeholder="Szukaj po tytule lub autorze..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <Btn onClick={openAddBook}>+ Dodaj książkę</Btn>
                </Toolbar>

                <Card>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Okładka</Th>
                        <Th>Tytuł</Th>
                        <Th>Autor</Th>
                        <Th>Rok</Th>
                        <Th>Cena</Th>
                        <Th>Magazyn</Th>
                        <Th>Gatunki</Th>
                        <Th>Akcje</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.length === 0 ? (
                        <EmptyRow><EmptyCell colSpan={8}>Brak książek</EmptyCell></EmptyRow>
                      ) : filteredBooks.map(b => (
                        <Tr key={b.id}>
                          <Td>
                            {b.coverUrl
                              ? <CoverImg src={b.coverUrl} alt={b.title} />
                              : <CoverPlaceholder><BookOpen size={16} /></CoverPlaceholder>}
                          </Td>
                          <Td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</Td>
                          <Td>{b.author}</Td>
                          <Td>{b.publicationYear ?? '—'}</Td>
                          <Td>{(b.price ?? 0).toFixed(2)} zł</Td>
                          <Td>{b.stockQuantity}</Td>
                          <Td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {b.genres?.join(', ') || '—'}
                          </Td>
                          <Td>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <Btn $variant="ghost" onClick={() => openEditBook(b)}>Edytuj</Btn>
                              <Btn $variant="danger" onClick={() => handleDeleteBook(b.id)}>Usuń</Btn>
                            </div>
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </>
            )}

            {/* ── Orders ───────────────────────────────────────────────────── */}
            {tab === 'orders' && (
              <>
                <Toolbar>
                  <SearchInput
                    placeholder="Szukaj po ID lub emailu..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="ALL">Wszystkie statusy</option>
                    {ORDER_STATUSES.map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </Select>
                </Toolbar>

                <Card>
                  <Table>
                    <thead>
                      <tr>
                        <Th>ID</Th>
                        <Th>Data</Th>
                        <Th>Klient</Th>
                        <Th>Kwota</Th>
                        <Th>Status</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <EmptyRow><EmptyCell colSpan={5}>Brak zamówień</EmptyCell></EmptyRow>
                      ) : filteredOrders.map(o => (
                        <Tr key={o.id}>
                          <Td>#{o.id}</Td>
                          <Td>{formatDate(o.createdAt)}</Td>
                          <Td>{o.userEmail}</Td>
                          <Td>{(o.totalPrice ?? 0).toFixed(2)} zł</Td>
                          <Td>
                            <StatusSelect
                              $status={o.status}
                              value={o.status}
                              onChange={e => handleStatusChange(o.id, e.target.value)}
                            >
                              {ORDER_STATUSES.map(s => (
                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                              ))}
                            </StatusSelect>
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </>
            )}

            {/* ── Users ────────────────────────────────────────────────────── */}
            {tab === 'users' && (
              <>
                <Toolbar>
                  <SearchInput
                    placeholder="Szukaj po nazwie lub emailu..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </Toolbar>

                <Card>
                  <Table>
                    <thead>
                      <tr>
                        <Th>ID</Th>
                        <Th>Nazwa</Th>
                        <Th>Email</Th>
                        <Th>Rola</Th>
                        <Th>Akcje</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <EmptyRow><EmptyCell colSpan={5}>Brak użytkowników</EmptyCell></EmptyRow>
                      ) : filteredUsers.map(u => (
                        <Tr key={u.id}>
                          <Td>#{u.id}</Td>
                          <Td>{u.username}</Td>
                          <Td>{u.email}</Td>
                          <Td>
                            <RoleBadge $admin={u.role === 'ROLE_ADMIN'}>
                              {u.role === 'ROLE_ADMIN' ? 'Admin' : 'Użytkownik'}
                            </RoleBadge>
                          </Td>
                          <Td>
                            {u.role !== 'ROLE_ADMIN' && (
                              <Btn $variant="danger" onClick={() => handleDeleteUser(u.id)}>Usuń</Btn>
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </>
            )}
          </>
        )}
      </Container>

      {/* ── Book Modal ─────────────────────────────────────────────────────── */}
      {showBookModal && (
        <Overlay onClick={e => e.target === e.currentTarget && setShowBookModal(false)}>
          <Modal>
            <ModalHeader>
              <ModalTitle>{editingBook ? 'Edytuj książkę' : 'Dodaj książkę'}</ModalTitle>
              <CloseBtn onClick={() => setShowBookModal(false)}>×</CloseBtn>
            </ModalHeader>

            <ModalBody>
              <div>
                <FieldLabel>Tytuł</FieldLabel>
                <FieldInput
                  value={bookForm.title}
                  onChange={e => setBookForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Tytuł książki"
                />
              </div>

              <div>
                <FieldLabel>Autor</FieldLabel>
                <FieldInput
                  value={bookForm.author}
                  onChange={e => setBookForm(p => ({ ...p, author: e.target.value }))}
                  placeholder="Imię i nazwisko autora"
                />
              </div>

              <div>
                <FieldLabel>Opis</FieldLabel>
                <FieldTextarea
                  value={bookForm.description ?? ''}
                  onChange={e => setBookForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Opis książki"
                />
              </div>

              <div>
                <FieldLabel>URL okładki</FieldLabel>
                <FieldInput
                  value={bookForm.coverUrl ?? ''}
                  onChange={e => setBookForm(p => ({ ...p, coverUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <FieldRow>
                <div>
                  <FieldLabel>Rok wydania</FieldLabel>
                  <FieldInput
                    type="number"
                    value={bookForm.publicationYear ?? ''}
                    onChange={e => setBookForm(p => ({ ...p, publicationYear: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <FieldLabel>Cena (zł)</FieldLabel>
                  <FieldInput
                    type="number"
                    min="0"
                    step="0.01"
                    value={bookForm.price}
                    onChange={e => setBookForm(p => ({ ...p, price: Number(e.target.value) }))}
                  />
                </div>
              </FieldRow>

              <div>
                <FieldLabel>Ilość w magazynie</FieldLabel>
                <FieldInput
                  type="number"
                  min="0"
                  value={bookForm.stockQuantity}
                  onChange={e => setBookForm(p => ({ ...p, stockQuantity: Number(e.target.value) }))}
                />
              </div>

              {genres.length > 0 && (
                <div>
                  <FieldLabel>Gatunki</FieldLabel>
                  <GenreGrid>
                    {genres.map(g => (
                      <GenreChip
                        key={g.id}
                        $selected={bookForm.genreIds?.includes(g.id) ?? false}
                        onClick={() => toggleGenre(g.id)}
                        type="button"
                      >
                        {g.name}
                      </GenreChip>
                    ))}
                  </GenreGrid>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Btn $variant="ghost" onClick={() => setShowBookModal(false)}>Anuluj</Btn>
              <Btn onClick={handleSaveBook} disabled={saving}>
                {saving ? 'Zapisywanie...' : 'Zapisz'}
              </Btn>
            </ModalFooter>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
