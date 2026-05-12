using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly GadgetStoreDbContext _context;

    public CategoryRepository(GadgetStoreDbContext context) => _context = context;

    public async Task<Category?> GetByIdAsync(int id) =>
        await _context.Categories
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

    public async Task<IEnumerable<Category>> GetAllAsync() =>
        await _context.Categories
            .Include(c => c.SubCategories)
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

    public async Task<IEnumerable<Category>> GetRootCategoriesAsync() =>
        await _context.Categories
            .Include(c => c.SubCategories)
            .Where(c => c.ParentCategoryId == null && c.IsActive)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

    public async Task<IEnumerable<Category>> GetSubCategoriesAsync(int parentId) =>
        await _context.Categories
            .Where(c => c.ParentCategoryId == parentId && c.IsActive)
            .OrderBy(c => c.SortOrder)
            .ToListAsync();

    public async Task AddAsync(Category category)
    {
        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Category category)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
    }
}
