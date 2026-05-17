'use client'

import { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { store, AppDispatch } from '@/store'
import { hydrate, fetchProfile } from '@/store/slices/authSlice'
import { GlobalStyle } from './Authlayout'

function AuthHydrator() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const token = localStorage.getItem('token')
    dispatch(hydrate(token))
    if (token) {
      dispatch(fetchProfile(token))
    }
  }, [dispatch])

  return null
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <AuthHydrator />
      {children}
    </Provider>
  )
}
