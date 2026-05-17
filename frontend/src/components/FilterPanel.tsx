'use client';

import styled from 'styled-components';

const Panel = styled.aside`
  width: 220px;
  min-width: 220px;
  background: #fff;
  border-radius: 10px;
  padding: 24px 20px;
  border: 1px solid #e8e3dc;
  align-self: flex-start;
`;

const Title = styled.h3`
  font-family: 'Georgia', serif;
  font-size: 18px;
  color: #3d2f1e;
  margin: 0 0 20px 0;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #5a4a3a;
  margin: 0 0 10px 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #c8bfb4;
  border-radius: 6px;
  font-size: 14px;
  color: #3d2f1e;
  background: #fff;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #b0a090;
  }

  &:focus {
    border-color: #7a6248;
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PriceInput = styled.input`
  width: 70px;
  padding: 6px 10px;
  border: 1px solid #c8bfb4;
  border-radius: 6px;
  font-size: 14px;
  color: #3d2f1e;
  background: #fff;
  outline: none;

  &:focus {
    border-color: #7a6248;
  }
`;

const Dash = styled.span`
  color: #9a8a7a;
`;

const RadioRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #3d2f1e;
  margin-bottom: 8px;
  cursor: pointer;
`;

const Radio = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #7a6248;
  cursor: pointer;
`;

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #3d2f1e;
  margin-bottom: 8px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #7a6248;
  cursor: pointer;
  flex-shrink: 0;
`;

const GenreName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ClearBtn = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  color: #9a8a7a;
  cursor: pointer;
  padding: 0;
  margin-top: 4px;
  text-decoration: underline;

  &:hover {
    color: #5a4a3a;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e8e3dc;
  margin: 0 0 24px 0;
`;

const YEAR_RANGES = ['Przed 1900', '1900–1950', '1950–2000', 'Po 2000'];

interface FilterPanelProps {
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  priceMin?: string;
  priceMax?: string;
  onPriceMinChange?: (val: string) => void;
  onPriceMaxChange?: (val: string) => void;
  selectedYear?: string | null;
  onYearChange?: (val: string | null) => void;
  genres?: string[];
  selectedGenres?: string[];
  onGenresChange?: (genres: string[]) => void;
}

export default function FilterPanel({
  showSearch = true,
  searchQuery = '',
  onSearchChange = () => {},
  priceMin = '',
  priceMax = '',
  onPriceMinChange = () => {},
  onPriceMaxChange = () => {},
  selectedYear = null,
  onYearChange = () => {},
  genres = [],
  selectedGenres = [],
  onGenresChange = () => {},
}: FilterPanelProps) {
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenresChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onGenresChange([...selectedGenres, genre]);
    }
  };

  return (
    <Panel>
      <Title>Filtry</Title>

      {showSearch && (
        <Section>
          <Label>Szukaj</Label>
          <SearchInput
            type="text"
            placeholder="Tytuł lub autor..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Section>
      )}

      {showSearch && <Divider />}

      <Section>
        <Label>Cena (zł)</Label>
        <PriceRow>
          <PriceInput
            type="number"
            placeholder="Od"
            value={priceMin}
            onChange={(e) => onPriceMinChange(e.target.value)}
            min={0}
          />
          <Dash>—</Dash>
          <PriceInput
            type="number"
            placeholder="Do"
            value={priceMax}
            onChange={(e) => onPriceMaxChange(e.target.value)}
            min={0}
          />
        </PriceRow>
      </Section>

      <Section>
        <Label>Rok wydania</Label>
        {YEAR_RANGES.map((range) => (
          <RadioRow key={range}>
            <Radio
              type="radio"
              name="yearRange"
              checked={selectedYear === range}
              onChange={() => onYearChange(range)}
            />
            {range}
          </RadioRow>
        ))}
        {selectedYear && (
          <ClearBtn onClick={() => onYearChange(null)}>Wyczyść</ClearBtn>
        )}
      </Section>

      {genres.length > 0 && (
        <Section>
          <Label>Gatunek</Label>
          {genres.map((genre) => (
            <CheckRow key={genre}>
              <Checkbox
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => toggleGenre(genre)}
              />
              <GenreName title={genre}>{genre}</GenreName>
            </CheckRow>
          ))}
          {selectedGenres.length > 0 && (
            <ClearBtn onClick={() => onGenresChange([])}>Wyczyść</ClearBtn>
          )}
        </Section>
      )}
    </Panel>
  );
}
