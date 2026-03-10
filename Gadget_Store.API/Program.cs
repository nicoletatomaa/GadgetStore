using GadgetStore.Infrastructure.Payments;
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

