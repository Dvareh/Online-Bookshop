'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/RegisterForm'
import Navbar from '@/components/Navbar'
import { AuthPage, PageWrapper, BackLink } from '@/components/Authlayout'
import { useAppDispatch, useAppSelector } from '@/store'
import { register, clearError } from '@/store/slices/authSlice'

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { status, error } = useAppSelector((s) => s.auth)

  const handleRegister = async (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    const result = await dispatch(
      register({ username: data.name, email: data.email, password: data.password })
    )
    if (register.fulfilled.match(result)) {
      if (result.payload?.token) {
        router.push('/profile')
      } else {
        router.push('/login')
      }
    }
  }

  useEffect(() => {
    return () => { dispatch(clearError()) }
  }, [dispatch])

  return (
    <AuthPage>
      <Navbar />
      <PageWrapper>
        <RegisterForm
          onSubmit={handleRegister}
          isLoading={status === 'loading'}
          error={error ?? ''}
        />
        <BackLink href="/">Powrót do katalogu</BackLink>
      </PageWrapper>
    </AuthPage>
  )
}
