'use client'

import React, { useState } from 'react'
import {
  Card,
  CardTitle,
  FormGroup,
  Label,
  Input,
  SubmitButton,
  FooterText,
  FooterLink,
  ErrorMessage}
  from './Authlayout'

interface RegisterFormProps {
  onSubmit: (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<void>
  isLoading?: boolean
  error?: string
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmError, setConfirmError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setConfirmError('Hasła nie są identyczne')
      return
    }
    setConfirmError('')
    await onSubmit({ name, email, password, confirmPassword })
  }

  return (
    <Card>
      <CardTitle>Rejestracja</CardTitle>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Imię</Label>
          <Input
            id="name"
            type="text"
            placeholder="Jan Kowalski"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="twoj@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Hasło</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          {confirmError && <ErrorMessage>{confirmError}</ErrorMessage>}
        </FormGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Rejestracja...' : 'Zarejestruj się'}
        </SubmitButton>
      </form>

      <FooterText>
        Masz już konto?{' '}
        <FooterLink href="/login">Zaloguj się</FooterLink>
      </FooterText>
    </Card>
  )
}