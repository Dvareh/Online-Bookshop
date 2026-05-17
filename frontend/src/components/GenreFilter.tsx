'use client';

import styled from 'styled-components';
import type { Genre } from '@/api';

const Select = styled.select`
  padding: 10px 14px;
  border: 1px solid #c8bfb4;
  border-radius: 8px;
  font-size: 14px;
  color: #3d2f1e;
  background: #fff;
  cursor: pointer;
  outline: none;
  min-width: 200px;

  &:focus {
    border-color: #7a6248;
  }
`;

interface Props {
  genres: Genre[];
  value: number | undefined;
  onChange: (id: number | undefined) => void;
}

export default function GenreFilter({ genres, value, onChange }: Props) {
  return (
    <Select
      value={value ?? ''}
      onChange={(e) =>
        onChange(e.target.value !== '' ? Number(e.target.value) : undefined)
      }
    >
      <option value="">Wszystkie gatunki</option>
      {genres.map((g) => (
        <option key={g.id} value={g.id}>
          {g.name}
        </option>
      ))}
    </Select>
  );
}
