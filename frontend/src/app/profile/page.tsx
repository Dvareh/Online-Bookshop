'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { OrderCard } from '@/components/OrderCard'
import type { OrderStatus } from '@/components/OrderCard'
import { useAppSelector } from '@/store'
import { getOrders } from '@/api'
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, token, initializing } = useAppSelector((s) => s.auth)

  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  useEffect(() => {
    if (!initializing && !token) {
      router.replace('/login')
    }
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
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice ?? o.total ?? 0), 0)
  const booksInCollection = orders.reduce((sum, o) => {
    const lines = o.orderItems ?? o.items ?? []
    return sum + lines.reduce((s, i) => s + (i.quantity ?? 1), 0)
  }, 0)

  const displayName = user?.username ?? '—'
  const displayEmail = user?.email ?? '—'

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
              <EditButton>
                <Image src="/setting.png" width={15} height={15} alt="settings" />
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
                {ordersLoading && (
                  <EmptyOrders>Ładowanie zamówień...</EmptyOrders>
                )}
                {!ordersLoading && ordersError && (
                  <ErrorMsg>Błąd: {ordersError}</ErrorMsg>
                )}
                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <EmptyOrders>Brak zamówień</EmptyOrders>
                )}
                {!ordersLoading && !ordersError && orders.map((order) => {
                  const lines = order.orderItems ?? order.items ?? []
                  const productsCount = lines.reduce((s, i) => s + (i.quantity ?? 1), 0)
                  return (
                    <OrderCard
                      key={order.id}
                      orderId={order.id}
                      date={formatDate(order.createdAt ?? order.orderDate ?? order.date)}
                      productsCount={productsCount}
                      total={order.totalPrice ?? order.total ?? 0}
                      status={normalizeStatus(order.status)}
                      items={lines.map((l) => ({
                        title: l.bookTitle ?? l.title,
                        quantity: l.quantity,
                        price: l.price,
                      }))}
                    />
                  )
                })}
              </OrdersList>
            </SectionCard>
          </RightColumn>
        </Grid>
      </Container>
    </PageWrapper>
  )
}
