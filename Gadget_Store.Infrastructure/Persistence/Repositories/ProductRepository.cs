using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly GadgetStoreDbContext _context;

    public ProductRepository(GadgetStoreDbContext context) => _context = context;

    public async Task<Product?> GetByIdAsync(Guid id) =>
        await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

    public async Task<IEnumerable<Product>> GetAllAsync(int page = 1, int pageSize = 20) =>
        await _context.Products
            .Where(p => p.IsActive)
            .Include(p => p.Category)
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId, int page = 1, int pageSize = 20) =>
        await _context.Products
            .Where(p => p.IsActive && p.CategoryId == categoryId)
            .Include(p => p.Category)
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<IEnumerable<Product>> SearchAsync(string query, int page = 1, int pageSize = 20) =>
        await _context.Products
            .Where(p => p.IsActive && (p.Name.Contains(query) || (p.Description != null && p.Description.Contains(query))))
            .Include(p => p.Category)
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<IEnumerable<Product>> GetTemplatesAsync() =>
        await _context.Products
            .Where(p => p.IsTemplate && p.IsActive)
            .ToListAsync();

    public async Task<int> CountAsync() =>
        await _context.Products.CountAsync(p => p.IsActive);

    public async Task AddAsync(Product product)
    {
        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product != null)
        {
            product.IsActive = false;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id) =>
        await _context.Products.AnyAsync(p => p.Id == id && p.IsActive);
}
