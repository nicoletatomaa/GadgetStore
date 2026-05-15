import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminCategoriesService } from '@/services/api'
import { useUiStore } from '@/store/uiStore'
import { getCatSvgIcon } from '@/components/ui/CategorySidebar'

type CatForm = {
  name: string
  parentCategoryId: string
  description: string
  sortOrder: string
}

const emptyForm: CatForm = { name: '', parentCategoryId: '', description: '', sortOrder: '0' }

export default function AdminCategoriesPage() {
  const qc = useQueryClient()
  const { addToast } = useUiStore()
  const [showModal, setShowModal]     = useState(false)
  const [editingId, setEditingId]     = useState<number | null>(null)
  const [form, setForm]               = useState<CatForm>(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null)

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn:  () => adminCategoriesService.getAll(),
  })

  /* flat display list: roots first, then indented children */
  const flatRows = (categories ?? []).flatMap((c) => [
    { id: c.id, name: c.name, parentId: null as number | null, parentName: null as string | null, subCount: (c.children ?? []).length },
    ...(c.children ?? []).map((s) => ({
      id: s.id, name: s.name, parentId: c.id, parentName: c.name, subCount: 0,
    })),
  ])

  const rootCats = categories ?? []

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () => {
      const payload = {
        name:             form.name.trim(),
        parentCategoryId: form.parentCategoryId ? parseInt(form.parentCategoryId) : undefined,
        description:      form.description.trim() || undefined,
        sortOrder:        parseInt(form.sortOrder) || 0,
      }
      return editingId
        ? adminCategoriesService.update(editingId, payload)
        : adminCategoriesService.create(payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] })
      qc.invalidateQueries({ queryKey: ['catalog-nav'] })
      addToast(editingId ? 'Categorie actualizata!' : 'Categorie creata!', 'success')
      closeModal()
    },
    onError: () => addToast('Eroare la salvare.', 'error'),
  })

  const { mutate: deleteCategory, isPending: deleting } = useMutation({
    mutationFn: (id: number) => adminCategoriesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] })
      qc.invalidateQueries({ queryKey: ['catalog-nav'] })
      addToast('Categorie stearsa!', 'success')
      setConfirmDelete(null)
    },
    onError: () => addToast('Eroare la stergere. Verifica daca are produse asociate.', 'error'),
  })

  const openCreate = () => {
    setEditingId(null); setForm(emptyForm); setShowModal(true)
  }

  const openEdit = (row: typeof flatRows[0]) => {
    setEditingId(row.id)
    setForm({ name: row.name, parentCategoryId: row.parentId ? String(row.parentId) : '', description: '', sortOrder: '0' })
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditingId(null); setForm(emptyForm) }

  const set = (f: keyof CatForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [f]: e.target.value }))

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Categorii</h1>
          <p className="text-sm text-ink-muted mt-0.5">
            {flatRows.length} categorii · {rootCats.length} radacina
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary px-5 py-2">
          + Categorie noua
        </button>
      </div>

      {/* Tabel */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-14 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-edge bg-surface-raised">
              <tr>
                {['Categorie', 'Parinte', 'Subcategorii', 'Actiuni'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-mono text-ink-faint uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {flatRows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-raised transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {row.parentId && <span className="text-ink-faint text-xs select-none">└</span>}
                      <span className="text-ink-muted">{getCatSvgIcon(row.name)}</span>
                      <span className={`font-semibold ${row.parentId ? 'text-ink-muted' : 'text-ink'}`}>
                        {row.name}
                      </span>
                      {!row.parentId && (
                        <span className="badge-blue text-[10px] px-1.5">Root</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-ink-muted text-xs font-mono">
                    {row.parentName ?? '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    {row.subCount > 0 ? (
                      <span className="text-xs font-mono text-brand">{row.subCount} sub</span>
                    ) : (
                      <span className="text-xs text-ink-faint">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => openEdit(row)}
                        className="text-xs text-accent hover:text-accent-dark transition-colors font-medium"
                      >
                        Editeaza
                      </button>
                      <button
                        onClick={() => setConfirmDelete({ id: row.id, name: row.name })}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Sterge
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {flatRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-ink-muted">
                    Nu exista categorii. Creeaza prima categorie.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal creare / editare */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-edge rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-edge flex items-center justify-between">
              <h2 className="font-display font-bold text-ink text-lg">
                {editingId ? 'Editeaza categorie' : 'Categorie noua'}
              </h2>
              <button onClick={closeModal} className="text-ink-faint hover:text-ink transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                  Nume categorie *
                </label>
                <input className="input" placeholder="ex: Telefoane, Gaming..." value={form.name} onChange={set('name')} autoFocus />
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                  Categorie parinte
                </label>
                <select className="input" value={form.parentCategoryId} onChange={set('parentCategoryId')} disabled={!!editingId}>
                  <option value="">— Categorie principala (root) —</option>
                  {rootCats.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {editingId && (
                  <p className="text-xs text-ink-faint mt-1">Parentul nu poate fi schimbat dupa creare.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                  Descriere <span className="text-ink-faint normal-case">(optional)</span>
                </label>
                <textarea
                  className="input w-full resize-none" rows={2}
                  placeholder="Descriere scurta..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                  Ordine sortare
                </label>
                <input type="number" className="input" value={form.sortOrder} onChange={set('sortOrder')} min={0} />
                <p className="text-xs text-ink-faint mt-1">0 = primul in lista. Numere mai mari = mai jos.</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-edge flex gap-3 justify-end">
              <button onClick={closeModal} className="btn-secondary">Anuleaza</button>
              <button
                onClick={() => save()}
                disabled={saving || !form.name.trim()}
                className="btn-primary min-w-[100px]"
              >
                {saving ? 'Se salveaza...' : editingId ? 'Salveaza' : 'Creeaza'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmare stergere */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-edge rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <h2 className="font-display font-bold text-ink text-lg">Sterge categorie</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Esti sigura ca vrei sa stergi{' '}
              <strong className="text-ink">{confirmDelete.name}</strong>?{' '}
              Produsele asociate vor ramane fara categorie si actiunea nu poate fi anulata.
            </p>
            <div className="flex gap-3 justify-end pt-1">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary">Anuleaza</button>
              <button
                onClick={() => deleteCategory(confirmDelete.id)}
                disabled={deleting}
                className="btn-danger"
              >
                {deleting ? 'Se sterge...' : 'Sterge definitiv'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
