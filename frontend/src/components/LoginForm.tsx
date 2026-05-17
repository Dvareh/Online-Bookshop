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
  ErrorMessage,
} from './Authlayout'

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>
  isLoading?: boolean
  error?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ email, password })
  }

  return (
    <Card>
      <CardTitle>Logowanie</CardTitle>

      <form onSubmit={handleSubmit}>
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
            autoComplete="current-password"
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Logowanie...' : 'Zaloguj się'}
        </SubmitButton>
      </form>

      <FooterText>
        Nie masz konta?{' '}
        <FooterLink href="/register">Zarejestruj się</FooterLink>
      </FooterText>
    </Card>
  )
}