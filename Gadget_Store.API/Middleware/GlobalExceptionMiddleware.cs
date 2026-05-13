using System.Net;
using System.Text.Json;

namespace GadgetStore.API.Middleware;

// Middleware global: prinde toate exceptiile netratatate si returneaza
// un raspuns JSON standardizat, fara a expune stack trace in productie.
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger,
        IHostEnvironment env)
    {
        _next   = next;
        _logger = logger;
        _env    = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (KeyNotFoundException ex)
        {
            await WriteErrorAsync(context, HttpStatusCode.NotFound, ex.Message);
        }
        catch (ArgumentException ex)
        {
            await WriteErrorAsync(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            await WriteErrorAsync(context, HttpStatusCode.Unauthorized, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exceptie neasteptata: {Message}", ex.Message);

            var message = _env.IsDevelopment()
                ? ex.Message
                : "A aparut o eroare interna. Incearca din nou mai tarziu.";

            await WriteErrorAsync(context, HttpStatusCode.InternalServerError, message);
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, HttpStatusCode status, string message)
    {
        context.Response.StatusCode  = (int)status;
        context.Response.ContentType = "application/json";

        var body = JsonSerializer.Serialize(new
        {
            status  = (int)status,
            error   = status.ToString(),
            message
        });

        await context.Response.WriteAsync(body);
    }
}
