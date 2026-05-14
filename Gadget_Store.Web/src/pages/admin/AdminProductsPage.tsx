import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsService, catalogService } from '@/services/api'
import { useUiStore } from '@/store/uiStore'
import type { Product } from '@/types'

type ProductForm = {
  name: string
  description: string
  price: string
  stock: string
  brand: string
  type: 'Electronics' | 'Accessory'
  categoryId: string
  imageUrl: string
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

export default function AdminProductsPage() {
  const queryClient  = useQueryClient()
  const { addToast } = useUiStore()
  const [search, setSearch]   = useState('')
  const [editing, setEditing] = useState<Product | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]       = useState<ProductForm>(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn:  () => productsService.getAll({ pageSize: 100 }),
  })

  const { data: categories } = useQuery({
    queryKey: ['catalog'],
    queryFn:  () => catalogService.getTree(),
  })

  const flatCats = categories?.flatMap((c) => [c, ...(c.children ?? [])]) ?? []

  const { mutate: saveProduct, isPending: saving } = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        price:      parseFloat(form.price),
        stock:      parseInt(form.stock),
        categoryId: parseInt(form.categoryId),
      }
      return editing
        ? productsService.update(editing.id, payload)
        : productsService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      addToast(editing ? 'Produs actualizat!' : 'Produs creat!', 'success')
      closeModal()
    },
    onError: () => addToast('Eroare la salvarea produsului.', 'error'),
  })

  const { mutate: deleteProduct } = useMutation({
    mutationFn: (id: number) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      addToast('Produs sters!', 'success')
      setConfirmDelete(null)
    },
    onError: () => addToast('Eroare la stergerea produsului.', 'error'),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm(toFormValues(p))
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const set = (field: keyof ProductForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }))

  const filtered = data?.items.filter((p) => {
    const q = search.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
  }) ?? []

  const formValid = form.name && form.price && form.stock && form.brand && form.categoryId

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">Produse</h1>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Cauta produs sau brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input text-sm py-2 w-56"
          />
          <button onClick={openCreate} className="btn-primary text-sm px-4 py-2">
            + Produs nou
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="card p-4 h-14 animate-pulse" />)}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Produs</th>
                <th className="px-4 py-3 font-medium">Pret</th>
                <th className="px-4 py-3 font-medium">Stoc</th>
                <th className="px-4 py-3 font-medium">Tip</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.brand}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-brand">{p.price.toFixed(2)} MDL</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.type}</td>
                  <td className="px-4 py-3">
                    <span className={p.isActive ? 'badge-green' : 'badge-gray'}>
                      {p.isActive ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(p)} className="text-xs text-blue-600 hover:underline">Editeaza</button>
                      <button onClick={() => setConfirmDelete(p)} className="text-xs text-red-500 hover:underline">Sterge</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Nu s-au gasit produse.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal creare/editare */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">{editing ? 'Editeaza produs' : 'Produs nou'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">вњ•</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nume produs *</label>
                <input className="input" placeholder="iPhone 16 Pro..." value={form.name} onChange={set('name')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Pret (RON) *</label>
                  <input type="number" className="input" placeholder="4999.99" value={form.price} onChange={set('price')} min={0} step={0.01} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Stoc *</label>
                  <input type="number" className="input" placeholder="10" value={form.stock} onChange={set('stock')} min={0} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Brand *</label>
                  <input className="input" placeholder="Apple, Samsung..." value={form.brand} onChange={set('brand')} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tip *</label>
                  <select className="input" value={form.type} onChange={set('type')}>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessory">Accessory</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Categorie *</label>
                <select className="input" value={form.categoryId} onChange={set('categoryId')}>
                  <option value="">Selecteaza categoria</option>
                  {flatCats.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">URL imagine</label>
                <input className="input" placeholder="https://..." value={form.imageUrl} onChange={set('imageUrl')} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Descriere</label>
                <textarea className="input w-full" rows={3} placeholder="Descrierea produsului..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={closeModal} className="btn-secondary">Anuleaza</button>
              <button
                onClick={() => saveProduct()}
                disabled={saving || !formValid}
                className="btn-primary disabled:opacity-50"
              >
                {saving ? 'Se salveaza...' : editing ? 'Salveaza' : 'Creeaza produs'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmare stergere */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <h2 className="font-bold text-lg">Sterge produs</h2>
            <p className="text-sm text-gray-600">
              Esti sigura ca vrei sa stergi <strong>{confirmDelete.name}</strong>? Aceasta actiune nu poate fi anulata.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary">Anuleaza</button>
              <button
                onClick={() => deleteProduct(confirmDelete.id)}
                className="bg-red-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Sterge definitiv
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

