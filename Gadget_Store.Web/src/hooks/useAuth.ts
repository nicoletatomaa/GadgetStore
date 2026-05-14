import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { authService } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import type { LoginRequest, RegisterRequest, ApiError } from '@/types'

function extractErrorMessage(err: unknown, fallback: string): string {
  const axiosErr = err as AxiosError<ApiError>
  return axiosErr?.response?.data?.message ?? fallback
}

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
    onError: (err) => {
      addToast(extractErrorMessage(err, 'Email sau parola incorecte.'), 'error')
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
    onError: (err) => {
      addToast(extractErrorMessage(err, 'Inregistrarea a esuat.'), 'error')
    },
  })
}
