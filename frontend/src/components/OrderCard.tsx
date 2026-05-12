import React, { useState } from 'react'
import styled from 'styled-components'
import { Package, ChevronUp, ChevronDown } from 'lucide-react'

export type OrderStatus = 'delivered' | 'in_transit' | 'processing' | 'cancelled'

export interface OrderItemLine {
  title?: string;
  bookTitle?: string;
  quantity: number;
  price: number;
}

export interface OrderCardProps {
  orderId: number
  date: string
  productsCount: number
  total: number
  status: OrderStatus
  items?: OrderItemLine[]
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  delivered: { label: 'Dostarczone', color: '#2d7a4f', bg: '#e8f5ee' },
  in_transit: { label: 'W drodze', color: '#5a6bbf', bg: '#eef0fb' },
  processing: { label: 'W realizacji', color: '#b07d2e', bg: '#fdf4e3' },
  cancelled: { label: 'Anulowane', color: '#b04040', bg: '#fbeaea' },
}

const Card = styled.div`
  border: 1px solid #e8e4de;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #f0ece6;
`

const OrderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const PackageIcon = styled.span`
  display: inline-flex;
  align-items: center;
  color: #8a7d6b;
`

const OrderName = styled.p`
  font-family: 'Lora', Georgia, serif;
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0;
`

const OrderDate = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 12px;
  color: #9a9086;
  margin: 2px 0 0;
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const StatusBadge = styled.span<{ $status: OrderStatus }>`
  font-family: 'Lato', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  color: ${({ $status }) => statusConfig[$status].color};
  background: ${({ $status }) => statusConfig[$status].bg};
`

const ToggleBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  font-size: 12px;
  color: #9a9086;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  transition: color 0.15s;

  &:hover {
    color: #4a4238;
  }
`

const CardBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
`

const ProductsInfo = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 13px;
  color: #7a7169;
  margin: 0;
`

const TotalWrapper = styled.div`
  text-align: right;
`

const TotalLabel = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 11px;
  color: #aaa39b;
  margin: 0 0 2px;
`

const TotalAmount = styled.p`
  font-family: 'Lora', Georgia, serif;
  font-size: 17px;
  font-weight: 700;
  color: #2c2c2c;
  margin: 0;
`

const ItemsSection = styled.div`
  border-top: 1px solid #f0ece6;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ItemLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
`

const ItemTitle = styled.span`
  font-size: 13px;
  color: #3d2f1e;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ItemMeta = styled.span`
  font-size: 12px;
  color: #9a9086;
  white-space: nowrap;
  flex-shrink: 0;
`

const ItemPrice = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #2c2c2c;
  white-space: nowrap;
  flex-shrink: 0;
`

export const OrderCard: React.FC<OrderCardProps> = ({
  orderId,
  date,
  productsCount,
  total,
  status,
  items,
}) => {
  const [expanded, setExpanded] = useState(false)
  const hasItems = items && items.length > 0

  return (
    <Card>
      <CardHeader>
        <OrderTitle>
          <PackageIcon><Package size={15} /></PackageIcon>
          <div>
            <OrderName>Zamówienie #{orderId}</OrderName>
          </div>
        </OrderTitle>
        <HeaderRight>
          <StatusBadge $status={status}>{statusConfig[status].label}</StatusBadge>
          {hasItems && (
            <ToggleBtn onClick={() => setExpanded((v) => !v)}>
              {expanded ? <><ChevronUp size={14} /> Zwiń</> : <><ChevronDown size={14} /> Rozwiń</>}
            </ToggleBtn>
          )}
        </HeaderRight>
      </CardHeader>

      <CardBody>
        <ProductsInfo>Produkty: {productsCount}</ProductsInfo>
        <TotalWrapper>
          <TotalLabel>Łącznie</TotalLabel>
          <TotalAmount>{total.toLocaleString('pl-PL')} zł</TotalAmount>
        </TotalWrapper>
      </CardBody>

      {expanded && hasItems && (
        <ItemsSection>
          {items!.map((item, idx) => {
            const title = item.bookTitle ?? item.title ?? 'Nieznana książka'
            const lineTotal = item.price * item.quantity
            return (
              <ItemLine key={idx}>
                <ItemTitle>{title}</ItemTitle>
                <ItemMeta>{item.quantity} × {item.price.toFixed(2)} zł</ItemMeta>
                <ItemPrice>{lineTotal.toFixed(2)} zł</ItemPrice>
              </ItemLine>
            )
          })}
        </ItemsSection>
      )}
    </Card>
  )
}
