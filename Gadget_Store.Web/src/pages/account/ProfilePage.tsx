import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import { api } from '@/services/api'
import type { UserInfo } from '@/types'

type Section = 'overview' | 'edit' | 'password'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { addToast }      = useUiStore()
  const [section, setSection] = useState<Section>('overview')

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName  ?? '',
    phone:     '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })

  const { mutate: updateProfile, isPending: savingProfile } = useMutation({
    mutationFn: () =>
      api.patch<UserInfo>('/api/auth/profile', profileForm).then((r) => r.data),
    onSuccess: (updated) => {
      updateUser(updated)
      addToast('Profil actualizat!', 'success')
      setSection('overview')
    },
    onError: () => addToast('Eroare la salvarea profilului.', 'error'),
  })

  const { mutate: changePassword, isPending: changingPassword } = useMutation({
    mutationFn: () =>
      api.patch('/api/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword:     passwordForm.newPassword,
      }),
    onSuccess: () => {
      addToast('Parola schimbata cu succes!', 'success')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setSection('overview')
    },
    onError: (err: any) =>
      addToast(err?.response?.data?.message ?? 'Eroare la schimbarea parolei.', 'error'),
  })

  const passwordsMatch = passwordForm.newPassword === passwordForm.confirmPassword
  const passwordValid  = passwordForm.newPassword.length >= 8

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header profil */}
      <div className="card p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-xl text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block
              ${user?.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {user?.role}
            </span>
          </div>
          <button onClick={() => setSection('edit')} className="btn-secondary text-sm shrink-0">
            Editeaza
          </button>
        </div>
      </div>

      {/* Quick nav */}
      {section === 'overview' && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Comenzile mele', href: '/account/orders', icon: '📦' },
              { label: 'Wishlist',       href: '/account/wishlist', icon: '❤️' },
              { label: 'Schimba parola', action: () => setSection('password'), icon: '🔒' },
            ].map((item) => (
              item.href ? (
                <Link key={item.label} to={item.href}
                  className="card p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                </Link>
              ) : (
                <button key={item.label} onClick={item.action}
                  className="card p-4 text-center hover:shadow-md transition-shadow w-full">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                </button>
              )
            ))}
          </div>
        </>
      )}

      {/* Formular editare profil */}
      {section === 'edit' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Editeaza profilul</h2>
            <button onClick={() => setSection('overview')} className="text-sm text-gray-400 hover:text-gray-600">✕ Anuleaza</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Prenume</label>
              <input className="input" value={profileForm.firstName}
                onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nume</label>
              <input className="input" value={profileForm.lastName}
                onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Telefon</label>
            <input type="tel" className="input" placeholder="+40 721 000 000" value={profileForm.phone}
              onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <button onClick={() => updateProfile()} disabled={savingProfile} className="btn-primary w-full py-2.5">
            {savingProfile ? 'Se salveaza...' : 'Salveaza modificarile'}
          </button>
        </div>
      )}

      {/* Formular schimbare parola */}
      {section === 'password' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Schimba parola</h2>
            <button onClick={() => setSection('overview')} className="text-sm text-gray-400 hover:text-gray-600">✕ Anuleaza</button>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Parola curenta</label>
            <input type="password" className="input" value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Parola noua (min. 8 caractere)</label>
            <input type="password" className="input" value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Confirma parola noua</label>
            <input type="password"
              className={`input ${passwordForm.confirmPassword && !passwordsMatch ? 'border-red-400' : ''}`}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} />
            {passwordForm.confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">Parolele nu coincid</p>
            )}
          </div>
          <button
            onClick={() => changePassword()}
            disabled={changingPassword || !passwordsMatch || !passwordValid || !passwordForm.currentPassword}
            className="btn-primary w-full py-2.5 disabled:opacity-50"
          >
            {changingPassword ? 'Se schimba...' : 'Schimba parola'}
          </button>
        </div>
      )}
    </div>
  )
}
