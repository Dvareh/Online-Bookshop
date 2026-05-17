'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/LoginForm'
import Navbar from '@/components/Navbar'
import { AuthPage, PageWrapper, BackLink } from '@/components/Authlayout'
import { useAppDispatch, useAppSelector } from '@/store'
import { login, fetchProfile, clearError } from '@/store/slices/authSlice'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { status, error, token, initializing } = useAppSelector((s) => s.auth)

  useEffect(() => {
    if (!initializing && token) {
      router.replace('/profile')
    }
  }, [initializing, token, router])

  const handleLogin = async (data: { email: string; password: string }) => {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      const token = result.payload.token
      if (token) {
        await dispatch(fetchProfile(token))
      }
      router.push('/profile')
    }
  }

  useEffect(() => {
    return () => { dispatch(clearError()) }
  }, [dispatch])

  return (
    <AuthPage>
      <Navbar />
      <PageWrapper>
        <LoginForm
          onSubmit={handleLogin}
          isLoading={status === 'loading'}
          error={error ?? ''}
        />
        <BackLink href="/">Powrót do katalogu</BackLink>
      </PageWrapper>
    </AuthPage>
  )
}
