using GadgetStore.Domain.Entities;
using GadgetStore.Infrastructure.Payments;
using GadgetStore.Infrastructure.Regional.Asia;
using GadgetStore.Infrastructure.Regional.EU;
using GadgetStore.Infrastructure.Regional.US;
using GadgetStore.Patterns.Creational;
using GadgetStore.Patterns.Creational.Prototype;
using System.Text;
using GadgetStore.Patterns.Structural.Composite;
using GadgetStore.Infrastructure.Checkout;
using GadgetStore.Patterns.Structural.Facade;

Console.OutputEncoding = Encoding.UTF8;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
     c.SwaggerDoc("v1", new() { Title = "GadgetStore API", Version = "v1" });
});

// ── Factory Method ────────────────────────────────────────────
builder.Services.AddSingleton<PaymentProvider>();

// ── Abstract Factory — Regional ───────────────────────────────
builder.Services.AddKeyedSingleton<IRegionalFactory, EURegionalFactory>("EU");
builder.Services.AddKeyedSingleton<IRegionalFactory, USRegionalFactory>("US");
builder.Services.AddKeyedSingleton<IRegionalFactory, AsiaRegionalFactory>("Asia");

// ── Prototype — Product Template Registry ─────────────────────
var registry = new ProductTemplateRegistry();

var iphone15Base = new ElectronicsProduct("iPhone 15 128GB", 1200m, 10, "Apple");
iphone15Base.Tags.AddRange(new[] { "smartphone", "apple", "5G" });

var airpodsBase = new AccessoryProduct("AirPods Pro", 200m, 15, "iPhone");
airpodsBase.Tags.AddRange(new[] { "audio", "wireless", "apple" });

var macbookBase = new ElectronicsProduct("MacBook Pro 14\"", 8500m, 5, "Apple");
macbookBase.Tags.AddRange(new[] { "laptop", "apple", "M3" });

registry.Register("iphone15-base", iphone15Base);
registry.Register("airpods-base", airpodsBase);
registry.Register("macbook-base", macbookBase);

builder.Services.AddSingleton(registry);

// ─────────────────────────────────────────────────────────────
// ── Composite — Catalog ───────────────────────────────────────
var rootCatalog = new CatalogCategory("GadgetStore Catalog");

var electronics = new CatalogCategory("Electronics");
var phones = new CatalogCategory("Phones");
phones.Add(new CatalogProduct("iPhone 15 128GB", 1200m));
phones.Add(new CatalogProduct("Samsung Galaxy S24", 950m));
var laptops = new CatalogCategory("Laptops");
laptops.Add(new CatalogProduct("MacBook Pro 14\"", 8500m));
laptops.Add(new CatalogProduct("Dell XPS 15", 5200m));
electronics.Add(phones);
electronics.Add(laptops);

var accessories = new CatalogCategory("Accessories");
accessories.Add(new CatalogProduct("AirPods Pro", 200m));
accessories.Add(new CatalogProduct("USB-C Hub", 85m));

rootCatalog.Add(electronics);
rootCatalog.Add(accessories);

// ── Façade — Checkout ─────────────────────────────────────────
builder.Services.AddScoped<ICheckoutFacade, CheckoutFacade>();

builder.Services.AddSingleton<ICatalogComponent>(rootCatalog);

// ── Command — Cart (Scoped: coș separat per sesiune HTTP) ─────
builder.Services.AddScoped<GadgetStore.Patterns.Behavioral.Command.Cart>();
builder.Services.AddScoped<GadgetStore.Patterns.Behavioral.Command.CartInvoker>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
     app.UseSwagger();
     app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();