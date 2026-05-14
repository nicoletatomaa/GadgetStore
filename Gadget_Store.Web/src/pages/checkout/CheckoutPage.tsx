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
  { id: 'standard', label: 'Standard',   description: '3-5 zile lucratoare', cost: 15 },
  { id: 'express',  label: 'Express',    description: '1-2 zile lucratoare', cost: 35 },
]

const PAYMENT_METHODS: { method: PaymentMethod; label: string; icon: string }[] = [
  { method: 'Card',   label: 'Card bancar',    icon: '💳' },
  { method: 'PayPal', label: 'PayPal',          icon: '🅿️' },
  { method: 'Stripe', label: 'Stripe',          icon: '⚡' },
  { method: 'Crypto', label: 'Criptomonede',    icon: '₿' },
]

const emptyAddr = { street: '', city: '', country: 'Romania', postalCode: '', region: '' }

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

  const { mutate: processCheckout, isPending } = useMutation({
    mutationFn: () => checkoutService.process(form),
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
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-brand text-white' : 'bg-gray-200 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1 hidden sm:block ${i === step ? 'text-brand font-medium' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="card p-6 space-y-4">
        {/* Step 0: Contact */}
        {step === 0 && (
          <>
            <h2 className="font-semibold text-lg">Informatii contact</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Prenume *</label>
                <input className="input" value={contact.firstName}
                  onChange={(e) => setContact((p) => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nume *</label>
                <input className="input" value={contact.lastName}
                  onChange={(e) => setContact((p) => ({ ...p, lastName: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email *</label>
              <input type="email" className="input" value={contact.email}
                onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Telefon</label>
              <input type="tel" className="input" placeholder="+40 721 000 000" value={contact.phone}
                onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))} />
            </div>
          </>
        )}

        {/* Step 1: Adresa */}
        {step === 1 && (
          <>
            <h2 className="font-semibold text-lg">Adresa de livrare</h2>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Strada *</label>
              <input className="input" placeholder="Str. Exemplu, nr. 1"
                value={form.shippingAddress.street} onChange={(e) => setAddr('street', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Oras *</label>
                <input className="input" placeholder="Bucuresti"
                  value={form.shippingAddress.city} onChange={(e) => setAddr('city', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cod postal *</label>
                <input className="input" placeholder="010101"
                  value={form.shippingAddress.postalCode} onChange={(e) => setAddr('postalCode', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tara</label>
              <input className="input" value={form.shippingAddress.country}
                onChange={(e) => setAddr('country', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Regiune fiscala</label>
              <select className="input" value={form.region}
                onChange={(e) => setForm((p) => ({ ...p, region: e.target.value as Region }))}>
                <option value="EU">Europa (TVA 21%)</option>
                <option value="US">Statele Unite (Tax 8.5%)</option>
                <option value="Asia">Asia (GST 10%)</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Afecteaza calculul taxelor - Abstract Factory pattern</p>
            </div>
          </>
        )}

        {/* Step 2: Livrare */}
        {step === 2 && (
          <>
            <h2 className="font-semibold text-lg">Metoda de livrare</h2>
            <div className="space-y-3">
              {SHIPPING_OPTIONS.map((opt) => (
                <label key={opt.id} className={`card p-4 flex items-center gap-3 cursor-pointer border-2 transition-colors
                  ${shippingMethod === opt.id ? 'border-brand bg-blue-50' : 'border-transparent'}`}>
                  <input type="radio" name="shipping" checked={shippingMethod === opt.id}
                    onChange={() => setShippingMethod(opt.id as 'standard' | 'express')}
                    className="w-4 h-4 text-brand" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.description}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{opt.cost} MDL</span>
                </label>
              ))}
            </div>
            {regional && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                <p className="font-medium text-gray-700">Estimare costuri ({form.region})</p>
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>{subtotal().toFixed(2)} MDL</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxa ({(regional.taxRate * 100).toFixed(0)}%)</span>
                  <span>{regional.taxAmount.toFixed(2)} MDL</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Livrare {shippingMethod}</span><span>{shippingCost} MDL</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>Total estimat</span><span className="text-brand">{totalEstimate.toFixed(2)} MDL</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 3: Plata */}
        {step === 3 && (
          <>
            <h2 className="font-semibold text-lg">Metoda de plata</h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(({ method, label, icon }) => (
                <label key={method} className={`card p-3 flex items-center gap-3 cursor-pointer border-2 transition-colors
                  ${form.paymentMethod === method ? 'border-brand bg-blue-50' : 'border-transparent'}`}>
                  <input type="radio" name="payment" checked={form.paymentMethod === method}
                    onChange={() => setForm((p) => ({ ...p, paymentMethod: method }))}
                    className="w-4 h-4 text-brand" />
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cod promotional (optional)</label>
              <div className="flex gap-2">
                <input className="input flex-1" placeholder="SUMMER20, LOYALTY..."
                  value={form.couponCode ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, couponCode: e.target.value }))} />
              </div>
              <p className="text-xs text-gray-400 mt-1">Strategy pattern - discount calculat automat la procesare</p>
            </div>
          </>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <>
            <h2 className="font-semibold text-lg">Sumar comanda</h2>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <p className="font-medium text-gray-700 mb-1">Contact</p>
                <p className="text-gray-600">{contact.firstName} {contact.lastName}</p>
                <p className="text-gray-600">{contact.email}</p>
                {contact.phone && <p className="text-gray-600">{contact.phone}</p>}
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <p className="font-medium text-gray-700 mb-1">Livrare</p>
                <p className="text-gray-600">{form.shippingAddress.street}, {form.shippingAddress.city}</p>
                <p className="text-gray-600">{form.shippingAddress.postalCode}, {form.shippingAddress.country}</p>
                <p className="text-gray-500">Regiune: {form.region} &middot; {shippingMethod === 'express' ? 'Express (35 MDL)' : 'Standard (15 MDL)'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <p className="font-medium text-gray-700 mb-1">Plata</p>
                <p className="text-gray-600">{PAYMENT_METHODS.find((m) => m.method === form.paymentMethod)?.label}</p>
                {form.couponCode && <p className="text-green-600">Cupon: {form.couponCode}</p>}
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <p className="font-medium text-gray-700 mb-2">Produse ({items.length})</p>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span className="truncate flex-1">{item.productName} &times; {item.quantity}</span>
                    <span className="ml-2 shrink-0">{(item.finalPrice * item.quantity).toFixed(2)} MDL</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>{subtotal().toFixed(2)} MDL</span>
                </div>
                {regional && (
                  <div className="flex justify-between text-gray-500">
                    <span>Taxa</span><span>{regional.taxAmount.toFixed(2)} MDL</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Livrare</span><span>{shippingCost} MDL</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-brand">{totalEstimate.toFixed(2)} MDL</span>
                </div>
              </div>
              <textarea className="input w-full mt-2" rows={2} placeholder="Note optionale pentru livrare..."
                value={form.notes ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            </div>
          </>
        )}
      </div>

      {/* Navigatie */}
      <div className="flex justify-between">
        <button onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="btn-secondary">
          &larr; Inapoi
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="btn-primary disabled:opacity-50"
          >
            Continua &rarr;
          </button>
        ) : (
          <button onClick={() => processCheckout()} disabled={isPending} className="btn-primary min-w-40">
            {isPending ? 'Se proceseaza...' : 'Plaseaza comanda'}
          </button>
        )}
      </div>
    </div>
  )
}
