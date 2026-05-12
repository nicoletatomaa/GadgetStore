using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

public class ProductRepository : BaseRepository<Product>, IProductRepository
{
    public ProductRepository(GadgetStoreDbContext context) : base(context) { }

    protected override DbSet<Product> GetSet() => Context.Products;

    public async Task<Product?> GetByIdAsync(Guid id) =>
        await Context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

    public async Task<IEnumerable<Product>> GetAllAsync(int page = 1, int pageSize = 20) =>
        await Context.Products
            .Where(p => p.IsActive)
            .Include(p => p.Category)
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId, int page = 1, int pageSize = 20) =>
        await Context.Products
            .Where(p => p.IsActive && p.CategoryId == categoryId)
            .Include(p => p.Category)
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<IEnumerable<Product>> SearchAsync(string query, int page = 1, int pageSize = 20) =>
        await Context.Products
            .Where(p => p.IsActive && (p.Name.Contains(query) || (p.Description != null && p.Description.Contains(query))))
            .Include(p => p.Category)
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<IEnumerable<Product>> GetTemplatesAsync() =>
        await Context.Products
            .Where(p => p.IsTemplate && p.IsActive)
            .ToListAsync();

    public async Task<int> CountAsync() =>
        await Context.Products.CountAsync(p => p.IsActive);

    public async Task DeleteAsync(Guid id)
    {
        var product = await Context.Products.FindAsync(id);
        if (product != null)
        {
            product.IsActive = false;
            await Context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id) =>
        await Context.Products.AnyAsync(p => p.Id == id && p.IsActive);
}
