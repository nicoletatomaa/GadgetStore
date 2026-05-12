using System.Text;
using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using GadgetStore.Infrastructure.Auth;
using GadgetStore.Infrastructure.Checkout;
using GadgetStore.Infrastructure.Payments;
using GadgetStore.Infrastructure.Persistence;
using GadgetStore.Infrastructure.Persistence.Repositories;
using GadgetStore.Infrastructure.Regional.Asia;
using GadgetStore.Infrastructure.Regional.EU;
using GadgetStore.Infrastructure.Regional.US;
using GadgetStore.Patterns.Creational;
using GadgetStore.Patterns.Creational.Prototype;
using GadgetStore.Patterns.Structural.Composite;
using GadgetStore.Patterns.Structural.Facade;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

Console.OutputEncoding = Encoding.UTF8;

var builder = WebApplication.CreateBuilder(args);

// ── Database ───────────────────────────────────────────────────────────────────
builder.Services.AddDbContext<GadgetStoreDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// ── Repository Pattern ─────────────────────────────────────────────────────────
builder.Services.AddScoped<IProductRepository,  ProductRepository>();
builder.Services.AddScoped<IOrderRepository,    OrderRepository>();
builder.Services.AddScoped<IUserRepository,     UserRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICartRepository,     CartRepository>();
builder.Services.AddScoped<ICouponRepository,   CouponRepository>();

// ── JWT Authentication ─────────────────────────────────────────────────────────
var jwtSection = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSection);
var jwtSettings = jwtSection.Get<JwtSettings>()!;

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
        ValidateIssuer           = true,
        ValidIssuer              = jwtSettings.Issuer,
        ValidateAudience         = true,
        ValidAudience            = jwtSettings.Audience,
        ValidateLifetime         = true,
        ClockSkew                = TimeSpan.Zero   // fara toleranta de timp
    };
});

builder.Services.AddAuthorization();

// ── Swagger / OpenAPI cu suport JWT Bearer ─────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title       = "GadgetStore API",
        Version     = "v1",
        Description = "Platforma e-commerce cu 12 Design Patterns GoF — ASP.NET Core 8.0 + MSSQL"
    });

    // Buton Authorize in Swagger UI pentru JWT Bearer
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name         = "Authorization",
        Type         = SecuritySchemeType.Http,
        Scheme       = "Bearer",
        BearerFormat = "JWT",
        In           = ParameterLocation.Header,
        Description  = "Introdu token-ul JWT: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ── CORS (pentru frontend React) ───────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// ── Factory Method — Payment Processors ───────────────────────────────────────
builder.Services.AddSingleton<PaymentProvider>();

// ── Abstract Factory — Regional (EU / US / Asia) ──────────────────────────────
builder.Services.AddKeyedSingleton<IRegionalFactory, EURegionalFactory>("EU");
builder.Services.AddKeyedSingleton<IRegionalFactory, USRegionalFactory>("US");
builder.Services.AddKeyedSingleton<IRegionalFactory, AsiaRegionalFactory>("Asia");

// ── Prototype — Product Template Registry ─────────────────────────────────────
var registry = new ProductTemplateRegistry();
var iphone15Base = new ElectronicsProduct("iPhone 15 128GB", 4699m, 40, "Apple");
iphone15Base.Tags.AddRange(new[] { "smartphone", "apple", "5G" });
var airpodsBase = new AccessoryProduct("AirPods Pro", 1299m, 50, "iPhone");
airpodsBase.Tags.AddRange(new[] { "audio", "wireless", "apple" });
var macbookBase = new ElectronicsProduct("MacBook Pro 14\"", 12999m, 10, "Apple");
macbookBase.Tags.AddRange(new[] { "laptop", "apple", "M4" });
registry.Register("iphone15-base", iphone15Base);
registry.Register("airpods-base",  airpodsBase);
registry.Register("macbook-base",  macbookBase);
builder.Services.AddSingleton(registry);

// ── Composite — Catalog ────────────────────────────────────────────────────────
var rootCatalog = new CatalogCategory("GadgetStore Catalog");
var elCat = new CatalogCategory("Electronice");
var phoneCat = new CatalogCategory("Telefoane");
phoneCat.Add(new CatalogProduct("iPhone 16 Pro", 6299m));
phoneCat.Add(new CatalogProduct("Samsung Galaxy S24 Ultra", 5499m));
var laptopCat = new CatalogCategory("Laptopuri");
laptopCat.Add(new CatalogProduct("MacBook Pro M4", 12999m));
laptopCat.Add(new CatalogProduct("Dell XPS 15", 7499m));
elCat.Add(phoneCat);
elCat.Add(laptopCat);
var accCat = new CatalogCategory("Accesorii");
accCat.Add(new CatalogProduct("AirPods Pro", 1299m));
accCat.Add(new CatalogProduct("Anker USB-C Hub", 249m));
rootCatalog.Add(elCat);
rootCatalog.Add(accCat);
builder.Services.AddSingleton<ICatalogComponent>(rootCatalog);

// ── Facade — Checkout ──────────────────────────────────────────────────────────
builder.Services.AddScoped<ICheckoutFacade, CheckoutFacade>();

// ── Command — Cart (Scoped per sesiune HTTP) ───────────────────────────────────
builder.Services.AddScoped<GadgetStore.Patterns.Behavioral.Command.Cart>();
builder.Services.AddScoped<GadgetStore.Patterns.Behavioral.Command.CartInvoker>();

// ─────────────────────────────────────────────────────────────────────────────
var app = builder.Build();

// ── Database Migration & Seeding ──────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<GadgetStoreDbContext>();
    var logger  = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        await DbSeeder.SeedAsync(context);
        logger.LogInformation("Baza de date initializata si seeded cu succes.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Eroare la initializarea bazei de date. Aplicatia continua fara seed.");
    }
}

// ── Middleware Pipeline ────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "GadgetStore API v1");
        c.RoutePrefix = string.Empty;   // Swagger la radacina: http://localhost:PORT/
    });
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");

app.UseAuthentication();   // JWT middleware — INAINTE de Authorization
app.UseAuthorization();

app.MapControllers();
app.Run();
