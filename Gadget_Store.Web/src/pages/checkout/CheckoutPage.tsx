import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { checkoutService } from '@/services/api'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import type { CheckoutRequest, PaymentMethod, Region } from '@/types'

const STEPS = ['Adresa', 'Livrare', 'Plata', 'Review']

const defaultAddress = { street: '', city: '', country: 'Romania', postalCode: '', region: '' }

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { clearCart } = useCartStore()
  const { addToast } = useUiStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<CheckoutRequest>({
    shippingAddress: { ...defaultAddress },
    billingAddress:  { ...defaultAddress },
    paymentMethod:   'Card',
    region:          'EU',
    couponCode:      '',
    notes:           '',
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${i <= step ? 'bg-brand text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-brand font-medium' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="card p-6 space-y-4">
        {/* Step 0: Adresa */}
        {step === 0 && (
          <>
            <h2 className="font-semibold">Adresa de livrare</h2>
            {(['street', 'city', 'postalCode'] as const).map((field) => (
              <input key={field} className="input" placeholder={field}
                value={form.shippingAddress[field]}
                onChange={(e) => setAddr(field, e.target.value)} />
            ))}
            <select className="input" value={form.region}
              onChange={(e) => setForm((p) => ({ ...p, region: e.target.value as Region }))}>
              <option value="EU">Europa (EU)</option>
              <option value="US">Statele Unite (US)</option>
              <option value="Asia">Asia</option>
            </select>
          </>
        )}

        {/* Step 1: Livrare */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="font-semibold">Metoda de livrare</h2>
            {[
              { label: 'Standard — 3-5 zile lucratoare', cost: '15 RON' },
              { label: 'Express — 1-2 zile lucratoare', cost: '35 RON' },
            ].map((opt) => (
              <label key={opt.label} className="card p-4 flex items-center gap-3 cursor-pointer">
                <input type="radio" name="shipping" className="w-4 h-4 text-brand" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{opt.label}</p>
                </div>
                <span className="text-sm font-bold text-gray-700">{opt.cost}</span>
              </label>
            ))}
          </div>
        )}

        {/* Step 2: Plata */}
        {step === 2 && (
          <div className="space-y-3">
            <h2 className="font-semibold">Metoda de plata</h2>
            {(['Card', 'PayPal', 'Crypto', 'Stripe'] as PaymentMethod[]).map((method) => (
              <label key={method} className="card p-4 flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" checked={form.paymentMethod === method}
                  onChange={() => setForm((p) => ({ ...p, paymentMethod: method }))}
                  className="w-4 h-4 text-brand" />
                <span className="text-sm font-medium">{method}</span>
              </label>
            ))}
            <input className="input" placeholder="Cod promotional (optional)"
              value={form.couponCode ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, couponCode: e.target.value }))} />
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-2 text-sm">
            <h2 className="font-semibold text-base">Sumar comanda</h2>
            <p><span className="text-gray-500">Adresa:</span> {form.shippingAddress.street}, {form.shippingAddress.city}</p>
            <p><span className="text-gray-500">Regiune:</span> {form.region}</p>
            <p><span className="text-gray-500">Plata:</span> {form.paymentMethod}</p>
            {form.couponCode && <p><span className="text-gray-500">Cupon:</span> {form.couponCode}</p>}
            <textarea className="input mt-2" rows={2} placeholder="Note optionale..."
              value={form.notes ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="btn-secondary">
          Inapoi
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} className="btn-primary">Continua</button>
        ) : (
          <button onClick={() => processCheckout()} disabled={isPending} className="btn-primary">
            {isPending ? 'Se proceseaza...' : 'Plaseaza comanda'}
          </button>
        )}
      </div>
    </div>
  )
}
