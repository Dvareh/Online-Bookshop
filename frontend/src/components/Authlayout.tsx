import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f4f1ec; }
`

export const AuthPage = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f1ec;
`

export const PageWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  font-family: 'Lato', sans-serif;
`

export const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Lora', Georgia, serif;
  font-size: 20px;
  font-weight: 600;
  color: #2c2c2c;
  text-decoration: none;
  margin-bottom: 28px;
  cursor: pointer;
`

export const LogoIcon = styled.span`
  font-size: 22px;
  color: #c8a96e;
`

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e8e4de;
  border-radius: 14px;
  padding: 40px 36px;
  width: 100%;
  max-width: 440px;
`

export const CardTitle = styled.h1`
  font-family: 'Lora', Georgia, serif;
  font-size: 24px;
  font-weight: 600;
  color: #2c2c2c;
  text-align: center;
  margin-bottom: 28px;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
`

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #4a4238;
`

export const Input = styled.input`
  width: 100%;
  padding: 13px 16px;
  background: #f4f1ec;
  border: 1px solid transparent;
  border-radius: 8px;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
  color: #2c2c2c;
  outline: none;
  transition: border-color 0.15s, background 0.15s;

  &::placeholder {
    color: #b5aca0;
  }

  &:focus {
    background: #ffffff;
    border-color: #c8a96e;
  }
`

export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 8px;
  background: #8a6e3e;
  border: none;
  border-radius: 8px;
  font-family: 'Lato', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.15s;

  &:hover {
    background: #7a6035;
  }

  &:active {
    background: #6b5229;
  }
`

export const FooterText = styled.p`
  font-size: 13px;
  color: #9a9086;
  text-align: center;
  margin-top: 20px;
`

export const FooterLink = styled.a`
  color: #8a6e3e;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.15s;
  &:hover { color: #6b5229; }
`

export const BackLink = styled.a`
  margin-top: 24px;
  font-size: 13px;
  color: #9a9086;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.15s;
  &:hover { color: #2c2c2c; }
`

export const ErrorMessage = styled.p`
  font-size: 12px;
  color: #b04040;
  margin-top: 2px;
`