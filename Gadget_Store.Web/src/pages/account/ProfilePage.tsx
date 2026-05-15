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
  const { addToast }         = useUiStore()
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
  const labelCls = 'block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5'

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-surface-base text-xl font-extrabold shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-xl text-ink">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-ink-muted font-mono">{user?.email}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium mt-1.5 inline-block
              ${user?.role === 'Admin'
                ? 'bg-brand-900 text-brand border border-brand/20'
                : 'bg-sky-950 text-sky-400 border border-sky-800/50'}`}>
              {user?.role}
            </span>
          </div>
          <button onClick={() => setSection('edit')} className="btn-secondary text-sm shrink-0">
            ✏️ Editeaza
          </button>
        </div>
      </div>

      {section === 'overview' && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Comenzile mele', href: '/account/orders',   icon: '📦' },
            { label: 'Wishlist',        href: '/account/wishlist', icon: '❤️' },
            { label: 'Schimba parola', action: () => setSection('password'), icon: '🔒' },
          ].map((item) =>
            item.href ? (
              <Link key={item.label} to={item.href}
                className="card p-5 text-center hover:border-brand/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.05)] transition-all group">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-semibold text-ink-muted group-hover:text-ink transition-colors">{item.label}</p>
              </Link>
            ) : (
              <button key={item.label} onClick={item.action}
                className="card p-5 text-center hover:border-brand/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.05)] transition-all group w-full">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-semibold text-ink-muted group-hover:text-ink transition-colors">{item.label}</p>
              </button>
            )
          )}
        </div>
      )}

      {section === 'edit' && (
        <div className="card p-6 space-y-5 relative overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-ink">Editeaza profilul</h2>
              <button onClick={() => setSection('overview')} className="text-xs font-mono text-ink-faint hover:text-ink transition-colors">✕ Anuleaza</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Prenume</label>
                <input className="input" value={profileForm.firstName}
                  onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Nume</label>
                <input className="input" value={profileForm.lastName}
                  onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Telefon</label>
              <input type="tel" className="input" placeholder="+373 69 000 000" value={profileForm.phone}
                onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <button onClick={() => updateProfile()} disabled={savingProfile} className="btn-primary w-full py-2.5">
              {savingProfile ? 'Se salveaza...' : 'Salveaza modificarile →'}
            </button>
          </div>
        </div>
      )}

      {section === 'password' && (
        <div className="card p-6 space-y-5 relative overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-ink">🔒 Schimba parola</h2>
              <button onClick={() => setSection('overview')} className="text-xs font-mono text-ink-faint hover:text-ink transition-colors">✕ Anuleaza</button>
            </div>
            <div>
              <label className={labelCls}>Parola curenta</label>
              <input type="password" className="input" value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Parola noua (min. 8 caractere)</label>
              <input type="password" className="input" value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Confirma parola noua</label>
              <input type="password"
                className={`input ${passwordForm.confirmPassword && !passwordsMatch ? 'border-red-400' : ''}`}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} />
              {passwordForm.confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-400 mt-1 font-mono">Parolele nu coincid</p>
              )}
            </div>
            <button onClick={() => changePassword()}
              disabled={changingPassword || !passwordsMatch || !passwordValid || !passwordForm.currentPassword}
              className="btn-primary w-full py-2.5 disabled:opacity-50">
              {changingPassword ? 'Se schimba...' : 'Schimba parola →'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
