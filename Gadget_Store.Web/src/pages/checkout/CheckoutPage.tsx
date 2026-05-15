import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { checkoutService, regionalService } from '@/services/api'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import type { CheckoutRequest, PaymentMethod, Region } from '@/types'

const STEPS = ['Contact', 'Adresa', 'Livrare', 'Plata', 'Review']

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard', description: '3-5 zile lucratoare', cost: 15 },
  { id: 'express',  label: 'Express',  description: '1-2 zile lucratoare', cost: 35 },
]

const PAYMENT_METHODS: { method: PaymentMethod; label: string; icon: string }[] = [
  { method: 'Card',   label: 'Card bancar',  icon: '💳' },
  { method: 'PayPal', label: 'PayPal',        icon: '🅿️' },
  { method: 'Stripe', label: 'Stripe',        icon: '⚡' },
  { method: 'Crypto', label: 'Criptomonede',  icon: '₿' },
]

const emptyAddr = { street: '', city: '', country: 'Moldova', postalCode: '', region: '' }
const labelCls  = 'block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5'
const sectionBox = 'bg-surface-raised border border-edge rounded-xl p-4 space-y-1'

export default function CheckoutPage() {
  const navigate     = useNavigate()
  const { clearCart, items, subtotal } = useCartStore()
  const { addToast } = useUiStore()
  const { user }     = useAuthStore()

  const [step, setStep] = useState(0)
  const [contact, setContact] = useState({
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName  ?? '',
    phone:     '',
    email:     user?.email ?? '',
  })
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard')
  const [form, setForm] = useState<CheckoutRequest>({
    shippingAddress: { ...emptyAddr },
    billingAddress:  { ...emptyAddr },
    paymentMethod:   'Card',
    region:          'EU',
    couponCode:      '',
    notes:           '',
  })

  const shippingCost = SHIPPING_OPTIONS.find((o) => o.id === shippingMethod)?.cost ?? 15

  const { data: regional } = useQuery({
    queryKey: ['regional', form.region, subtotal()],
    queryFn:  () => regionalService.calculate(form.region as Region, subtotal()),
    enabled:  step >= 2,
  })

  const { data: summary } = useQuery({
    queryKey: ['checkout-summary', form.region, form.couponCode, subtotal()],
    queryFn:  () => checkoutService.getSummary({ ...form, shippingCost }),
    enabled:  step === 4,
  })

  const { mutate: processCheckout, isPending } = useMutation({
    mutationFn: () => checkoutService.process({ ...form, shippingCost }),
    onSuccess: (result) => {
      if (result.success && result.orderId) {
        clearCart()
        navigate(`/checkout/confirm/${result.orderId}`)
      } else {
        addToast(result.message || 'Checkout esuat.', 'error')
      }
    },
    onError: () => addToast('Eroare la procesarea comenzii.', 'error'),
  })

  const setAddr = (field: keyof typeof form['shippingAddress'], value: string) =>
    setForm((p) => ({ ...p, shippingAddress: { ...p.shippingAddress, [field]: value } }))

  const canNext = (): boolean => {
    if (step === 0) return !!(contact.firstName && contact.lastName && contact.email)
    if (step === 1) return !!(form.shippingAddress.street && form.shippingAddress.city && form.shippingAddress.postalCode)
    return true
  }

  const totalEstimate = subtotal() + (regional?.taxAmount ?? 0) + shippingCost

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Checkout</h1>
        <p className="text-xs font-mono text-ink-faint mt-0.5">PASUL {step + 1} DIN {STEPS.length}</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${i < step
                  ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : i === step
                  ? 'bg-brand text-surface-base shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-surface-raised border border-edge text-ink-faint'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] mt-1 hidden sm:block font-mono ${i === step ? 'text-brand' : 'text-ink-faint'}`}>
                {s.toUpperCase()}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 transition-colors ${i < step ? 'bg-emerald-500' : 'bg-edge'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="card p-6 space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative z-10 space-y-5">

          {/* Step 0: Contact */}
          {step === 0 && (
            <>
              <h2 className="font-display font-semibold text-ink text-lg flex items-center gap-2">
                <span>👤</span> Informatii contact
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Prenume *</label>
                  <input className="input" value={contact.firstName}
                    onChange={(e) => setContact((p) => ({ ...p, firstName: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Nume *</label>
                  <input className="input" value={contact.lastName}
                    onChange={(e) => setContact((p) => ({ ...p, lastName: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Email *</label>
                <input type="email" className="input" value={contact.email}
                  onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Telefon</label>
                <input type="tel" className="input" placeholder="+373 69 000 000" value={contact.phone}
                  onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))} />
              </div>
            </>
          )}

          {/* Step 1: Adresa */}
          {step === 1 && (
            <>
              <h2 className="font-display font-semibold text-ink text-lg flex items-center gap-2">
                <span>📍</span> Adresa de livrare
              </h2>
              <div>
                <label className={labelCls}>Strada *</label>
                <input className="input" placeholder="Str. Stefan cel Mare, nr. 1"
                  value={form.shippingAddress.street} onChange={(e) => setAddr('street', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Oras *</label>
                  <input className="input" placeholder="Chisinau"
                    value={form.shippingAddress.city} onChange={(e) => setAddr('city', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Cod postal *</label>
                  <input className="input" placeholder="MD-2001"
                    value={form.shippingAddress.postalCode} onChange={(e) => setAddr('postalCode', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Tara</label>
                <input className="input" value={form.shippingAddress.country}
                  onChange={(e) => setAddr('country', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Regiune fiscala</label>
                <select className="input" value={form.region}
                  onChange={(e) => setForm((p) => ({ ...p, region: e.target.value as Region }))}>
                  <option value="EU">Europa (TVA 19%)</option>
                  <option value="US">Statele Unite (Tax 8.5%)</option>
                  <option value="Asia">Asia (GST 12%)</option>
                </select>
              </div>
            </>
          )}

          {/* Step 2: Livrare */}
          {step === 2 && (
            <>
              <h2 className="font-display font-semibold text-ink text-lg flex items-center gap-2">
                <span>🚚</span> Metoda de livrare
              </h2>
              <div className="space-y-3">
                {SHIPPING_OPTIONS.map((opt) => (
                  <label key={opt.id} className={`card p-4 flex items-center gap-3 cursor-pointer border-2 transition-all
                    ${shippingMethod === opt.id ? 'border-brand bg-brand/5' : 'border-transparent hover:border-edge'}`}>
                    <input type="radio" name="shipping" checked={shippingMethod === opt.id}
                      onChange={() => setShippingMethod(opt.id as 'standard' | 'express')}
                      className="w-4 h-4 accent-[#F59E0B]" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">{opt.label}</p>
                      <p className="text-xs text-ink-muted">{opt.description}</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-brand">{opt.cost} MDL</span>
                  </label>
                ))}
              </div>
              {regional && (
                <div className={sectionBox}>
                  <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-2">
                    Estimare costuri — {form.region}
                  </p>
                  <div className="flex justify-between text-sm text-ink-muted">
                    <span>Subtotal</span><span className="font-mono">{subtotal().toFixed(2)} MDL</span>
                  </div>
                  <div className="flex justify-between text-sm text-ink-muted">
                    <span>Taxa ({(regional.taxRate * 100).toFixed(0)}%)</span>
                    <span className="font-mono">{regional.taxAmount.toFixed(2)} MDL</span>
                  </div>
                  <div className="flex justify-between text-sm text-ink-muted">
                    <span>Livrare {shippingMethod}</span>
                    <span className="font-mono">{shippingCost} MDL</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-edge pt-2 mt-1">
                    <span className="text-ink">Total estimat</span>
                    <span className="font-mono text-brand">{totalEstimate.toFixed(2)} MDL</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 3: Plata */}
          {step === 3 && (
            <>
              <h2 className="font-display font-semibold text-ink text-lg flex items-center gap-2">
                <span>💳</span> Metoda de plata
              </h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(({ method, label, icon }) => (
                  <label key={method} className={`card p-3 flex items-center gap-3 cursor-pointer border-2 transition-all
                    ${form.paymentMethod === method ? 'border-brand bg-brand/5' : 'border-transparent hover:border-edge'}`}>
                    <input type="radio" name="payment" checked={form.paymentMethod === method}
                      onChange={() => setForm((p) => ({ ...p, paymentMethod: method }))}
                      className="w-4 h-4 accent-[#F59E0B]" />
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm font-semibold text-ink">{label}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className={labelCls}>Cod promotional (optional)</label>
                <input className="input w-full" placeholder="SUMMER20, LOYALTY..."
                  value={form.couponCode ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, couponCode: e.target.value }))} />
              </div>
            </>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <>
              <h2 className="font-display font-semibold text-ink text-lg flex items-center gap-2">
                <span>📋</span> Sumar comanda
              </h2>
              <div className="space-y-3 text-sm">
                <div className={sectionBox}>
                  <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-2">Contact</p>
                  <p className="text-ink-muted">{contact.firstName} {contact.lastName}</p>
                  <p className="text-ink-muted">{contact.email}</p>
                  {contact.phone && <p className="text-ink-muted">{contact.phone}</p>}
                </div>
                <div className={sectionBox}>
                  <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-2">Livrare</p>
                  <p className="text-ink-muted">{form.shippingAddress.street}, {form.shippingAddress.city}</p>
                  <p className="text-ink-muted">{form.shippingAddress.postalCode}, {form.shippingAddress.country}</p>
                  <p className="text-ink-faint font-mono text-xs">
                    {form.region} &middot; {shippingMethod === 'express' ? 'Express (35 MDL)' : 'Standard (15 MDL)'}
                  </p>
                </div>
                <div className={sectionBox}>
                  <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-2">Plata</p>
                  <p className="text-ink-muted">{PAYMENT_METHODS.find((m) => m.method === form.paymentMethod)?.label}</p>
                  {form.couponCode && <p className="text-emerald-400 font-mono text-xs">Cupon: {form.couponCode}</p>}
                </div>
                <div className={sectionBox}>
                  <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-2">
                    Produse ({items.length})
                  </p>
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-ink-muted">
                      <span className="truncate flex-1">{item.productName} &times; {item.quantity}</span>
                      <span className="ml-2 shrink-0 font-mono">{(item.finalPrice * item.quantity).toFixed(2)} MDL</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-edge pt-3 space-y-1.5">
                  <div className="flex justify-between text-ink-muted">
                    <span>Subtotal</span>
                    <span className="font-mono">{(summary?.subtotal ?? subtotal()).toFixed(2)} MDL</span>
                  </div>
                  {(summary?.discountAmount ?? 0) > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({form.couponCode})</span>
                      <span className="font-mono">-{summary!.discountAmount.toFixed(2)} MDL</span>
                    </div>
                  )}
                  <div className="flex justify-between text-ink-muted">
                    <span>Taxa ({summary ? ((summary.taxRate ?? 0) * 100).toFixed(0) : (regional ? (regional.taxRate * 100).toFixed(0) : '—')}%)</span>
                    <span className="font-mono">{(summary?.taxAmount ?? regional?.taxAmount ?? 0).toFixed(2)} MDL</span>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <span>Livrare</span>
                    <span className="font-mono">{(summary?.shippingCost ?? shippingCost).toFixed(2)} MDL</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-edge pt-2">
                    <span className="text-ink">Total</span>
                    <span className="font-mono text-brand">
                      {(summary?.totalAmount ?? totalEstimate).toFixed(2)} MDL
                    </span>
                  </div>
                </div>
                <textarea className="input w-full" rows={2} placeholder="Note optionale pentru livrare..."
                  value={form.notes ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
              </div>
            </>
          )}

        </div>
      </div>

      {/* Navigatie */}
      <div className="flex justify-between">
        <button onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="btn-secondary disabled:opacity-30">
          ← Inapoi
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="btn-primary disabled:opacity-40">
            Continua →
          </button>
        ) : (
          <button onClick={() => processCheckout()} disabled={isPending} className="btn-primary min-w-44">
            {isPending ? 'Se proceseaza...' : '✓ Plaseaza comanda'}
          </button>
        )}
      </div>

    </div>
  )
}
