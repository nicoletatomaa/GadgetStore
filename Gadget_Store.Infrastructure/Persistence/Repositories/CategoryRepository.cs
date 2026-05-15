using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
{
    public CategoryRepository(GadgetStoreDbContext context) : base(context) { }

    protected override DbSet<Category> GetSet() => Context.Categories;

    public async Task<Category?> GetByIdAsync(int id) =>
        await Context.Categories
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

    public async Task<IEnumerable<Category>> GetAllAsync() =>
        await Context.Categories
            .Include(c => c.SubCategories)
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

    public async Task<IEnumerable<Category>> GetRootCategoriesAsync() =>
        await Context.Categories
            .Include(c => c.SubCategories)
            .Where(c => c.ParentCategoryId == null && c.IsActive)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

    public async Task<IEnumerable<Category>> GetSubCategoriesAsync(int parentId) =>
        await Context.Categories
            .Where(c => c.ParentCategoryId == parentId && c.IsActive)
            .OrderBy(c => c.SortOrder)
            .ToListAsync();

    public async Task DeleteAsync(int id)
    {
        var category = await Context.Categories.FindAsync(id);
        if (category is null) return;
        Context.Categories.Remove(category);
        await Context.SaveChangesAsync();
    }
}
