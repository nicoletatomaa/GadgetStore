using GadgetStore.Infrastructure.Payments;
using GadgetStore.Infrastructure.Regional.Asia;
using GadgetStore.Infrastructure.Regional.EU;
using GadgetStore.Infrastructure.Regional.US;
using GadgetStore.Patterns.Creational;
using System.Text;

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

// ─────────────────────────────────────────────────────────────
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
     app.UseSwagger();
     app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();