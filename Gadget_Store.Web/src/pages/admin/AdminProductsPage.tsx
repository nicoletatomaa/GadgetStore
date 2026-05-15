import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsService, catalogService } from '@/services/api'
import { useUiStore } from '@/store/uiStore'
import type { Product } from '@/types'

type ProductForm = {
  name: string; description: string; price: string; stock: string
  brand: string; type: 'Electronics' | 'Accessory'; categoryId: string; imageUrl: string
}

const emptyForm: ProductForm = {
  name: '', description: '', price: '', stock: '',
  brand: '', type: 'Electronics', categoryId: '', imageUrl: '',
}

function toFormValues(p: Product): ProductForm {
  return {
    name: p.name, description: p.description ?? '', price: String(p.price),
    stock: String(p.stock), brand: p.brand, type: p.type,
    categoryId: String(p.categoryId), imageUrl: p.imageUrl ?? '',
  }
}

const labelCls = 'block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5'

export default function AdminProductsPage() {
  const queryClient  = useQueryClient()
  const { addToast } = useUiStore()
  const [search, setSearch]         = useState('')
  const [editing, setEditing]       = useState<Product | null>(null)
  const [showModal, setShowModal]   = useState(false)
  const [form, setForm]             = useState<ProductForm>(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn:  () => productsService.getAll({ pageSize: 100 }),
  })

  const { data: categories, isError: catsError } = useQuery({
    queryKey: ['admin-categories'],
    queryFn:  () => catalogService.getCategories(),
    retry: 1,
  })

  const flatCats = categories?.flatMap((c) => [
    { id: c.id, name: c.name },
    ...(c.children ?? []).map((s) => ({ id: s.id, name: `  ${s.name}` })),
  ]) ?? []

  const { mutate: saveProduct, isPending: saving } = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        price:      parseFloat(form.price),
        stock:      parseInt(form.stock),
        categoryId: parseInt(form.categoryId),
      }
      return editing ? productsService.update(editing.id, payload) : productsService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      addToast(editing ? 'Produs actualizat!' : 'Produs creat!', 'success')
      closeModal()
    },
    onError: () => addToast('Eroare la salvarea produsului.', 'error'),
  })

  const { mutate: deleteProduct } = useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      addToast('Produs sters!', 'success')
      setConfirmDelete(null)
    },
    onError: () => addToast('Eroare la stergerea produsului.', 'error'),
  })

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit   = (p: Product) => { setEditing(p); setForm(toFormValues(p)); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm) }

  const set = (field: keyof ProductForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }))

  const filtered = data?.items.filter((p) => {
    const q = search.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
  }) ?? []

  const formValid = form.name && form.price && form.stock && form.brand

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Produse</h1>
          <p className="text-xs font-mono text-ink-faint mt-0.5">{filtered.length} PRODUSE</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="search" placeholder="Cauta produs sau brand..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input text-sm py-2 w-56" />
          <button onClick={openCreate} className="btn-primary text-sm px-4 py-2">+ Produs nou</button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="card h-14 animate-pulse" />)}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-edge bg-surface-raised">
              <tr>
                {['Produs', 'Pret', 'Stoc', 'Tip', 'Status', 'Actiuni'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-mono text-ink-faint uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surface-raised transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">{p.name}</p>
                    <p className="text-xs text-ink-faint font-mono">{p.brand}</p>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-brand">{p.price.toFixed(2)} MDL</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold
                      ${p.stock > 10
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                        : p.stock > 0
                        ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                        : 'bg-red-950 text-red-400 border border-red-800/50'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-ink-muted">{p.type}</td>
                  <td className="px-4 py-3">
                    <span className={p.isActive ? 'badge-green' : 'badge-gray'}>
                      {p.isActive ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(p)} className="text-xs font-mono text-accent hover:text-accent-dark transition-colors">Editeaza</button>
                      <button onClick={() => setConfirmDelete(p)} className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors">Sterge</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-faint font-mono text-sm">Nu s-au gasit produse.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal creare/editare */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-edge rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 border-b border-edge flex items-center justify-between">
              <h2 className="font-display font-bold text-ink text-lg">
                {editing ? '✏️ Editeaza produs' : '+ Produs nou'}
              </h2>
              <button onClick={closeModal} className="text-ink-faint hover:text-ink transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Nume produs *</label>
                <input className="input" placeholder="iPhone 16 Pro..." value={form.name} onChange={set('name')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Pret (MDL) *</label>
                  <input type="number" className="input" placeholder="4999" value={form.price} onChange={set('price')} min={0} step={0.01} />
                </div>
                <div>
                  <label className={labelCls}>Stoc *</label>
                  <input type="number" className="input" placeholder="10" value={form.stock} onChange={set('stock')} min={0} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Brand *</label>
                  <input className="input" placeholder="Apple, Samsung..." value={form.brand} onChange={set('brand')} />
                </div>
                <div>
                  <label className={labelCls}>Tip *</label>
                  <select className="input" value={form.type} onChange={set('type')}>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessory">Accessory</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Categorie</label>
                {catsError && <p className="text-xs text-red-400 font-mono mb-1">Nu s-au putut incarca categoriile.</p>}
                <select className="input" value={form.categoryId} onChange={set('categoryId')}>
                  <option value="">Fara categorie</option>
                  {flatCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>URL imagine</label>
                <input className="input" placeholder="https://..." value={form.imageUrl} onChange={set('imageUrl')} />
              </div>
              <div>
                <label className={labelCls}>Descriere</label>
                <textarea className="input w-full resize-none" rows={3} placeholder="Descrierea produsului..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-edge flex gap-3 justify-end">
              <button onClick={closeModal} className="btn-secondary">Anuleaza</button>
              <button onClick={() => saveProduct()} disabled={saving || !formValid} className="btn-primary disabled:opacity-50">
                {saving ? 'Se salveaza...' : editing ? 'Salveaza' : 'Creeaza produs'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmare stergere */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-edge rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <h2 className="font-display font-bold text-ink text-lg">⚠️ Sterge produs</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Esti sigura ca vrei sa stergi <strong className="text-ink">{confirmDelete.name}</strong>?
              Aceasta actiune nu poate fi anulata.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary">Anuleaza</button>
              <button onClick={() => deleteProduct(confirmDelete.id)}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-950 text-red-400 border border-red-800/50 hover:bg-red-900 transition-colors">
                Sterge definitiv
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
