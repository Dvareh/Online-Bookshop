'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import Image from 'next/image'
import { Settings, Eye, EyeOff } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { OrderCard } from '@/components/OrderCard'
import type { OrderStatus } from '@/components/OrderCard'
import { useAppSelector, useAppDispatch } from '@/store'
import { logout, fetchProfile } from '@/store/slices/authSlice'
import { getOrders, updateProfile } from '@/api'
import type { OrderDTO } from '@/api'

const PageWrapper = styled.main`
  min-height: 100vh;
  background: #f4f1ec;
  font-family: 'Lato', sans-serif;
`

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 60px;
`

const PageTitle = styled.h1`
  font-family: 'Lora', Georgia, serif;
  font-size: 24px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0 0 28px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e8e4de;
  border-radius: 12px;
  padding: 28px 24px;
`

const AvatarWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ede8e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  font-size: 28px;
  color: #9a8c7c;
`

const UserName = styled.h2`
  font-family: 'Lora', Georgia, serif;
  font-size: 18px;
  font-weight: 600;
  color: #2c2c2c;
  text-align: center;
  margin: 0 0 4px;
`

const UserEmail = styled.p`
  font-size: 13px;
  color: #9a9086;
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f0ece6;
  margin: 18px 0;
`

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

const MetaLabel = styled.span`
  font-size: 13px;
  color: #9a9086;
`

const MetaValue = styled.span`
  font-size: 13px;
  color: #2c2c2c;
  font-weight: 500;
`

const EditButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 11px;
  background: #ede8e0;
  border: none;
  border-radius: 8px;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #4a4238;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: background 0.15s;
  &:hover { background: #e0d8cc; }
`

const StatsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const StatItem = styled.div``

const StatLabel = styled.p`
  font-size: 13px;
  color: #9a9086;
  margin: 0 0 2px;
`

const StatValue = styled.p<{ $accent?: boolean }>`
  font-family: 'Lora', Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  color: ${({ $accent }) => ($accent ? '#c8a96e' : '#2c2c2c')};
  margin: 0;
`

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SectionCard = styled.div`
  background: #ffffff;
  border: 1px solid #e8e4de;
  border-radius: 12px;
  padding: 24px;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`

const SectionTitle = styled.h3`
  font-family: 'Lora', Georgia, serif;
  font-size: 17px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const ContinueLink = styled.a`
  font-size: 13px;
  color: #9a9086;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.15s;
  &:hover { color: #2c2c2c; }
`

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const EmptyOrders = styled.p`
  font-size: 14px;
  color: #aaa39b;
  text-align: center;
  padding: 24px 0;
  margin: 0;
`

const ErrorMsg = styled.p`
  font-size: 13px;
  color: #b04040;
  text-align: center;
  padding: 16px 0;
  margin: 0;
`

const LoadingWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f1ec;
  font-family: 'Lato', sans-serif;
  font-size: 15px;
  color: #9a9086;
`

// ── Edit modal ────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
`

const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 460px;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0ece6;
`

const ModalTitle = styled.h2`
  font-family: 'Lora', Georgia, serif;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0;
`

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #9a9086;
  cursor: pointer;
  line-height: 1;
  padding: 2px;
  &:hover { color: #2c2c2c; }
`

const ModalBody = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #7a6248;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  display: block;
  margin-bottom: 5px;
`

const FieldInput = styled.input<{ $error?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid ${p => p.$error ? '#c0392b' : '#d8d0c8'};
  border-radius: 8px;
  font-size: 14px;
  color: #3d2f1e;
  background: #fff;
  outline: none;
  font-family: 'Lato', sans-serif;
  &:focus { border-color: ${p => p.$error ? '#c0392b' : '#7a6248'}; }
`

const PasswordWrap = styled.div`
  position: relative;
`

const ToggleVisBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9a9086;
  display: inline-flex;
  align-items: center;
  &:hover { color: #3d2f1e; }
`

const FieldError = styled.span`
  font-size: 11px;
  color: #c0392b;
  display: block;
  margin-top: 4px;
`

const FieldHint = styled.p`
  font-size: 11px;
  color: #9a9086;
  margin: 4px 0 0;
`

const EmailWarning = styled.p`
  font-size: 12px;
  color: #b07d2e;
  background: #fdf4e3;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 0;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f0ece6;
`

const ModalSaveError = styled.p`
  font-size: 13px;
  color: #b04040;
  text-align: center;
  margin: 0 0 8px;
`

const Btn = styled.button<{ $variant?: 'ghost' }>`
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s;
  background: ${p => p.$variant === 'ghost' ? '#f0ece6' : '#7a6248'};
  color: ${p => p.$variant === 'ghost' ? '#4a4238' : '#fff'};
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

// ─────────────────────────────────────────────────────────────────────────────

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

function normalizeStatus(raw: string): OrderStatus {
  const s = (raw ?? '').toUpperCase()
  if (s === 'DELIVERED' || s === 'COMPLETED' || s === 'DONE') return 'delivered'
  if (s === 'IN_TRANSIT' || s === 'SHIPPED' || s === 'SENT') return 'in_transit'
  if (s === 'CANCELLED' || s === 'CANCELED') return 'cancelled'
  return 'processing'
}

function formatDate(d: string | undefined): string {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('pl-PL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
  } catch { return d }
}

export default function ProfilePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, token, initializing } = useAppSelector((s) => s.auth)

  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!initializing && !token) router.replace('/login')
  }, [initializing, token, router])

  useEffect(() => {
    if (!token) return
    setOrdersLoading(true)
    getOrders()
      .then(setOrders)
      .catch((e: Error) => setOrdersError(e.message))
      .finally(() => setOrdersLoading(false))
  }, [token])

  if (initializing || !token) {
    return <LoadingWrapper>Ładowanie...</LoadingWrapper>
  }

  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice ?? 0), 0)
  const booksInCollection = orders.reduce((sum, o) => {
    return sum + o.items.reduce((s, i) => s + i.quantity, 0)
  }, 0)

  const displayName = user?.username ?? '—'
  const displayEmail = user?.email ?? '—'

  // ── Edit handlers ──────────────────────────────────────────────────────────

  const openEdit = () => {
    setEditForm({ username: user?.username ?? '', email: user?.email ?? '', password: '', confirmPassword: '' })
    setEditErrors({})
    setSaveError(null)
    setShowEdit(true)
  }

  const validateEdit = (): boolean => {
    const e: Record<string, string> = {}
    if (!editForm.username.trim()) e.username = 'Wymagane'
    if (!editForm.email.trim()) e.email = 'Wymagane'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) e.email = 'Nieprawidłowy adres email'
    if (editForm.password) {
      if (!PASSWORD_REGEX.test(editForm.password))
        e.password = 'Min. 8 znaków, litery i cyfry'
      else if (editForm.password !== editForm.confirmPassword)
        e.confirmPassword = 'Hasła nie pasują'
    }
    setEditErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSaveEdit = async () => {
    if (!validateEdit()) return
    setSaving(true)
    setSaveError(null)

    const payload: { username?: string; email?: string; password?: string } = {
      username: editForm.username,
      email: editForm.email,
    }
    if (editForm.password) payload.password = editForm.password

    try {
      await updateProfile(payload)
      const emailChanged = editForm.email !== user?.email

      if (emailChanged) {
        dispatch(logout())
        router.push('/login')
      } else {
        await dispatch(fetchProfile(token))
        setShowEdit(false)
      }
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Błąd zapisu.')
    } finally {
      setSaving(false)
    }
  }

  const setField = (field: keyof typeof editForm, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
    setEditErrors(prev => ({ ...prev, [field]: '' }))
  }

  const emailChanged = editForm.email !== (user?.email ?? '')

  return (
    <PageWrapper>
      <Navbar />

      <Container>
        <PageTitle>Moje konto</PageTitle>

        <Grid>
          <LeftColumn>
            <Card>
              <AvatarWrapper>
                <Image src="/person.png" width={48} height={48} alt="avatar" />
              </AvatarWrapper>
              <UserName>{displayName}</UserName>
              <UserEmail>{displayEmail}</UserEmail>
              <Divider />
              {user?.id && (
                <MetaRow>
                  <MetaLabel>ID użytkownika:</MetaLabel>
                  <MetaValue>#{user.id}</MetaValue>
                </MetaRow>
              )}
              <EditButton onClick={openEdit}>
                <Settings size={15} />
                Edytuj profil
              </EditButton>
            </Card>

            <Card>
              <StatsGrid>
                <StatItem>
                  <StatLabel>Zamówienia</StatLabel>
                  <StatValue>{totalOrders}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Łączne wydatki</StatLabel>
                  <StatValue $accent>
                    {totalSpent.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
                  </StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Książki w kolekcji</StatLabel>
                  <StatValue>{booksInCollection}</StatValue>
                </StatItem>
              </StatsGrid>
            </Card>
          </LeftColumn>

          <RightColumn>
            <SectionCard>
              <SectionHeader>
                <SectionTitle>Historia zamówień</SectionTitle>
                <ContinueLink href="/">Kontynuj zakupy</ContinueLink>
              </SectionHeader>

              <OrdersList>
                {ordersLoading && <EmptyOrders>Ładowanie zamówień...</EmptyOrders>}
                {!ordersLoading && ordersError && <ErrorMsg>Błąd: {ordersError}</ErrorMsg>}
                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <EmptyOrders>Brak zamówień</EmptyOrders>
                )}
                {!ordersLoading && !ordersError && orders.map((order) => {
                  const productsCount = order.items.reduce((s, i) => s + i.quantity, 0)
                  return (
                    <OrderCard
                      key={order.id}
                      orderId={order.id}
                      date={formatDate(undefined)}
                      productsCount={productsCount}
                      total={order.totalPrice}
                      status={normalizeStatus(order.status)}
                      items={order.items.map((l) => ({
                        title: l.title,
                        quantity: l.quantity,
                        price: l.priceAtPurchase,
                      }))}
                    />
                  )
                })}
              </OrdersList>
            </SectionCard>
          </RightColumn>
        </Grid>
      </Container>

      {/* ── Edit modal ────────────────────────────────────────────────────── */}
      {showEdit && (
        <Overlay onClick={e => e.target === e.currentTarget && setShowEdit(false)}>
          <Modal>
            <ModalHeader>
              <ModalTitle>Edytuj profil</ModalTitle>
              <CloseBtn onClick={() => setShowEdit(false)}>×</CloseBtn>
            </ModalHeader>

            <ModalBody>
              <div>
                <FieldLabel>Nazwa użytkownika</FieldLabel>
                <FieldInput
                  value={editForm.username}
                  $error={!!editErrors.username}
                  onChange={e => setField('username', e.target.value)}
                  placeholder="Twoja nazwa"
                />
                {editErrors.username && <FieldError>{editErrors.username}</FieldError>}
              </div>

              <div>
                <FieldLabel>Adres email</FieldLabel>
                <FieldInput
                  type="email"
                  value={editForm.email}
                  $error={!!editErrors.email}
                  onChange={e => setField('email', e.target.value)}
                  placeholder="twoj@email.com"
                />
                {editErrors.email && <FieldError>{editErrors.email}</FieldError>}
                {emailChanged && (
                  <EmailWarning>
                    Zmiana adresu email spowoduje wylogowanie — zaloguj się ponownie nowym adresem.
                  </EmailWarning>
                )}
              </div>

              <div>
                <FieldLabel>Nowe hasło <span style={{ fontWeight: 400, textTransform: 'none', color: '#9a9086' }}>(opcjonalne)</span></FieldLabel>
                <PasswordWrap>
                  <FieldInput
                    type={showPassword ? 'text' : 'password'}
                    value={editForm.password}
                    $error={!!editErrors.password}
                    onChange={e => setField('password', e.target.value)}
                    placeholder="Zostaw puste, aby nie zmieniać"
                    style={{ paddingRight: 38 }}
                  />
                  <ToggleVisBtn type="button" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </ToggleVisBtn>
                </PasswordWrap>
                {editErrors.password
                  ? <FieldError>{editErrors.password}</FieldError>
                  : <FieldHint>Min. 8 znaków, zawiera litery i cyfry</FieldHint>
                }
              </div>

              {editForm.password && (
                <div>
                  <FieldLabel>Potwierdź hasło</FieldLabel>
                  <PasswordWrap>
                    <FieldInput
                      type={showConfirm ? 'text' : 'password'}
                      value={editForm.confirmPassword}
                      $error={!!editErrors.confirmPassword}
                      onChange={e => setField('confirmPassword', e.target.value)}
                      placeholder="Powtórz nowe hasło"
                      style={{ paddingRight: 38 }}
                    />
                    <ToggleVisBtn type="button" onClick={() => setShowConfirm(v => !v)}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </ToggleVisBtn>
                  </PasswordWrap>
                  {editErrors.confirmPassword && <FieldError>{editErrors.confirmPassword}</FieldError>}
                </div>
              )}

              {saveError && <ModalSaveError>{saveError}</ModalSaveError>}
            </ModalBody>

            <ModalFooter>
              <Btn $variant="ghost" onClick={() => setShowEdit(false)}>Anuluj</Btn>
              <Btn onClick={handleSaveEdit} disabled={saving}>
                {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </Btn>
            </ModalFooter>
          </Modal>
        </Overlay>
      )}
    </PageWrapper>
  )
}
