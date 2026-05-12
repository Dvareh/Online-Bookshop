'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { BookOpen } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/slices/authSlice';

const Nav = styled.nav`
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e8e3dc;
`;

const NavInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  height: 100%;
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Georgia', serif;
  font-size: 20px;
  font-weight: 600;
  color: #3d2f1e;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const NavLink = styled.a`
  font-size: 15px;
  color: #5a4a3a;
  text-decoration: none;
  cursor: pointer;
  &:hover { color: #3d2f1e; }
`;

const RegisterButton = styled.a`
  background: #7a6248;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 22px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover { background: #5e4a36; }
`;

const CartBtn = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  color: #5a5249;
  padding: 0;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -6px;
  background: #c8a96e;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserChipLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #5a5249;
  cursor: pointer;
  text-decoration: none;
`;

const LogoutBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #9a9086;
  &:hover { color: #2c2c2c; }
`;

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { token, user, initializing } = useAppSelector((s) => s.auth);
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <Nav>
      <NavInner>
        <Logo href="/">
          <BookOpen size={22} strokeWidth={1.5} />
          <span>Księgarnia</span>
        </Logo>
        <NavLinks>
          {!initializing && token ? (
            <>
              <CartBtn onClick={() => router.push('/cart')}>
                <Image src="/shopping-bag.png" width={22} height={22} alt="cart" />
                {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
              </CartBtn>
              <UserChipLink href="/profile">
                <Image src="/person.png" width={20} height={20} alt="avatar" />
                {user?.username ?? ''}
              </UserChipLink>
              <LogoutBtn title="Wyloguj" onClick={handleLogout}>
                <Image src="/logout.png" width={18} height={18} alt="logout" />
              </LogoutBtn>
            </>
          ) : (
            <>
              <NavLink href="/login">Zaloguj</NavLink>
              <RegisterButton href="/register">Rejestracja</RegisterButton>
            </>
          )}
        </NavLinks>
      </NavInner>
    </Nav>
  );
}
