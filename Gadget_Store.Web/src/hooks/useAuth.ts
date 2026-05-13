import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import type { LoginRequest, RegisterRequest } from '@/types'

export function useLogin() {
  const { setAuth } = useAuthStore()
  const { addToast } = useUiStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (res) => {
      setAuth(res.user, res.accessToken, res.refreshToken)
      addToast(`Bun venit, ${res.user.firstName}!`, 'success')
      navigate('/')
    },
    onError: () => {
      addToast('Email sau parola incorecte.', 'error')
    },
  })
}

export function useRegister() {
  const { setAuth } = useAuthStore()
  const { addToast } = useUiStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (res) => {
      setAuth(res.user, res.accessToken, res.refreshToken)
      addToast('Cont creat cu succes!', 'success')
      navigate('/')
    },
    onError: () => {
      addToast('Inregistrarea a esuat. Emailul poate fi deja folosit.', 'error')
    },
  })
}
