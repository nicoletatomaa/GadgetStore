namespace GadgetStore.API.DTOs;

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