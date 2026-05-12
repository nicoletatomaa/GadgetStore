namespace GadgetStore.Domain.Entities;

public class Category
{
    public int Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public int? ParentCategoryId { get; private set; }
    public string? Description { get; private set; }
    public string? ImageUrl { get; private set; }
    public int SortOrder { get; private set; }
    public bool IsActive { get; private set; } = true;

    public Category? ParentCategory { get; private set; }
    public ICollection<Category> SubCategories { get; private set; } = new List<Category>();
    public ICollection<Product> Products { get; private set; } = new List<Product>();

    protected Category() { }

    public Category(string name, int? parentCategoryId = null, string? description = null, string? imageUrl = null, int sortOrder = 0)
    {
        Name = name;
        ParentCategoryId = parentCategoryId;
        Description = description;
        ImageUrl = imageUrl;
        SortOrder = sortOrder;
    }

    public void Update(string name, string? description, string? imageUrl, int sortOrder)
    {
        Name = name;
        Description = description;
        ImageUrl = imageUrl;
        SortOrder = sortOrder;
    }
}
