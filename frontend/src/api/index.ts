const API_URL = process.env.NEXT_PUBLIC_API_URL;

const authHeader = (): Record<string, string> => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Genre {
  id: number;
  name: string;
}

export const getBooks = async (page: number = 0, size: number = 12) => {
  const res = await fetch(
    `${API_URL}/books/search?page=${page}&size=${size}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
    }
  );

  if (!res.ok) throw new Error('Error fetching books');
  return res.json();
};

export const searchBooks = async (params: {
  title?: string;
  author?: string;
  genreId?: number;
  sort?: string;
  page?: number;
  size?: number;
}) => {
  const query = new URLSearchParams();
  if (params.title) query.set('title', params.title);
  if (params.author) query.set('author', params.author);
  if (params.genreId !== undefined)
    query.set('genreId', String(params.genreId));
  if (params.sort) query.set('sort', params.sort);
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));

  const res = await fetch(`${API_URL}/books/search?${query}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  });

  if (!res.ok) throw new Error('Error searching books');
  return res.json();
};

export const getGenres = async (): Promise<Genre[]> => {
  const res = await fetch(`${API_URL}/genres/get`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  });

  if (!res.ok) throw new Error('Error fetching genres');
  return res.json();
};

export const getBookById = async (id: number) => {
  const res = await fetch(`${API_URL}/books/get/${id}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  });

  if (!res.ok) throw new Error('Error fetching book');
  return res.json();
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Nieprawidłowy email lub hasło.');
  return res.json();
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) throw new Error('Błąd rejestracji. Spróbuj ponownie.');
  return res.json();
};

export const getMyProfile = async (token: string) => {
  const res = await fetch(`${API_URL}/user/me/get`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Error fetching profile');
  return res.json();
};

export interface OrderItemDTO {
  id?: number;
  bookId?: number;
  bookTitle?: string;
  title?: string;
  quantity: number;
  price: number;
}

export interface OrderDTO {
  id: number;
  createdAt?: string;
  orderDate?: string;
  date?: string;
  totalPrice?: number;
  total?: number;
  status: string;
  orderItems?: OrderItemDTO[];
  items?: OrderItemDTO[];
}

export const getOrders = async (): Promise<OrderDTO[]> => {
  const res = await fetch(`${API_URL}/orders/get`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  });

  if (!res.ok) throw new Error('Error fetching orders');
  return res.json();
};

export const createOrder = async (payload: {
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  items: { bookId: number; quantity: number; price: number }[];
  total: number;
}) => {
  const res = await fetch(`${API_URL}/orders/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Błąd składania zamówienia. Spróbuj ponownie.');
  return res.json();
};