import client from './client'
import type { User } from '../types'

export const signup = (data: {
  email: string
  password: string
  name: string
  phone?: string
  term_service: boolean
  term_privacy: boolean
  term_marketing: boolean
}) => client.post<User>('/auth/signup', data)

export const login = (data: { email: string; password: string }) =>
  client.post<{ access_token: string; token_type: string }>('/auth/login', data)

export const getMe = () => client.get<User>('/auth/me')
