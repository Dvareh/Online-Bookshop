import styled from 'styled-components';
import Navbar from '@/components/Navbar';
import CatalogClient from '@/components/CatalogClient';

const Page = styled.div`
  min-height: 100vh;
  background: #f5f0ea;
`;

export default function HomePage() {
  return (
    <Page>
      <Navbar />
      <CatalogClient />
    </Page>
  );
}