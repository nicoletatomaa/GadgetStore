using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

// ─────────────────────────────────────────────────────────────────────────────
// PATTERN: Template Method (Behavioral GoF)
//
// Problema: Toate repository-urile repeta acelasi cod pentru AddAsync si
// UpdateAsync (AddAsync → GetSet().Add → SaveChanges; Update → GetSet().Update
// → SaveChanges). Duplicarea creste riscul de erori si face mentenanta dificila.
//
// Solutie: BaseRepository defineste scheletul algoritmului (template) o singura
// data. Metoda abstracta GetSet() este "operatia primitiva" pe care fiecare
// subclasa concreta o implementeaza returnand propriul DbSet<TEntity>.
// Hook-urile BeforeAdd / BeforeUpdate pot fi suprascrise optional.
//
// Ierarhie:
//   BaseRepository<TEntity>          ← template cu Add / Update
//   ├── ProductRepository             ← GetSet() = Context.Products
//   ├── OrderRepository               ← GetSet() = Context.Orders
//   ├── UserRepository                ← GetSet() = Context.Users
//   ├── CategoryRepository            ← GetSet() = Context.Categories
//   ├── CartRepository                ← GetSet() = Context.CartItems
//   └── CouponRepository              ← GetSet() = Context.Coupons
// ─────────────────────────────────────────────────────────────────────────────
public abstract class BaseRepository<TEntity> where TEntity : class
{
    protected readonly GadgetStoreDbContext Context;

    protected BaseRepository(GadgetStoreDbContext context) => Context = context;

    // Operatie primitiva — fiecare subclasa indica ce DbSet sa foloseasca
    protected abstract DbSet<TEntity> GetSet();

    // Template method: schelet Add comun tuturor repository-urilor
    public virtual async Task AddAsync(TEntity entity)
    {
        BeforeAdd(entity);
        await GetSet().AddAsync(entity);
        await Context.SaveChangesAsync();
    }

    // Template method: schelet Update comun tuturor repository-urilor
    public virtual async Task UpdateAsync(TEntity entity)
    {
        BeforeUpdate(entity);
        GetSet().Update(entity);
        await Context.SaveChangesAsync();
    }

    // Hook optional — suprascris de subclase pentru logica inainte de Add
    protected virtual void BeforeAdd(TEntity entity) { }

    // Hook optional — suprascris de subclase pentru logica inainte de Update
    protected virtual void BeforeUpdate(TEntity entity) { }
}
