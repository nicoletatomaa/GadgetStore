using System.ComponentModel.DataAnnotations;

namespace GadgetStore.API.DTOs;

public class CreateProductRequest
{
    [Required, MaxLength(300)] public string Name          { get; set; } = string.Empty;
    [Required]                 public decimal Price        { get; set; }
    [Required]                 public int Stock            { get; set; }
    [Required, MaxLength(100)] public string Brand         { get; set; } = string.Empty;
    [Required]                 public string Type          { get; set; } = "Electronics"; // Electronics | Accessory
                               public int? CategoryId      { get; set; }
    [MaxLength(500)]           public string? ImageUrl     { get; set; }
                               public string? Description  { get; set; }
}

public class UpdateProductRequest
{
    [MaxLength(300)] public string? Name        { get; set; }
                     public decimal? Price       { get; set; }
                     public int? Stock           { get; set; }
    [MaxLength(100)] public string? Brand        { get; set; }
                     public int? CategoryId      { get; set; }
    [MaxLength(500)] public string? ImageUrl     { get; set; }
                     public string? Description  { get; set; }
                     public bool? IsActive       { get; set; }
}

public class CloneProductRequest
{
     /// <summary>Cheia prototipului din registry (ex: "iphone15-base")</summary>
     public string TemplateKey { get; set; } = string.Empty;

     /// <summary>Suprascrie numele — opțional</summary>
     public string? Name { get; set; }

     /// <summary>Suprascrie prețul — opțional</summary>
     public decimal? Price { get; set; }

     /// <summary>Suprascrie stocul — opțional</summary>
     public int? Stock { get; set; }

     /// <summary>Tag-uri adiționale de adăugat pe clonă</summary>
     public List<string> ExtraTags { get; set; } = new();
}