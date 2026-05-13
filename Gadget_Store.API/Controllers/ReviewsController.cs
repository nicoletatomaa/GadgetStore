using System.Security.Claims;
using GadgetStore.API.DTOs;
using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewRepository  _reviews;
    private readonly IProductRepository _products;

    public ReviewsController(IReviewRepository reviews, IProductRepository products)
    {
        _reviews  = reviews;
        _products = products;
    }

    /// <summary>Returneaza toate recenziile unui produs.</summary>
    [HttpGet("products/{productId:guid}")]
    public async Task<IActionResult> GetByProduct(Guid productId)
    {
        var list = await _reviews.GetByProductAsync(productId);

        return Ok(list.Select(r => new
        {
            r.Id,
            r.Rating,
            r.Comment,
            r.IsVerified,
            r.CreatedAt,
            Author = r.User?.FirstName ?? "Anonim"
        }));
    }

    /// <summary>
    /// Adauga o recenzie pentru un produs. Un utilizator poate lasa o singura recenzie per produs.
    /// </summary>
    [HttpPost("products/{productId:guid}")]
    [Authorize]
    public async Task<IActionResult> AddReview(Guid productId, [FromBody] AddReviewRequest req)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();

        if (!await _products.ExistsAsync(productId))
            return NotFound(new { message = "Produsul nu a fost gasit." });

        if (await _reviews.ExistsAsync(productId, userId))
            return Conflict(new { message = "Ai deja o recenzie pentru acest produs." });

        var review = new Review(productId, userId, req.Rating, req.Comment);
        await _reviews.AddAsync(review);

        return StatusCode(StatusCodes.Status201Created, new
        {
            review.Id,
            review.Rating,
            review.Comment,
            review.CreatedAt
        });
    }

    /// <summary>Sterge o recenzie — doar proprietarul sau Admin.</summary>
    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var review = await _reviews.GetByIdAsync(id);
        if (review is null)
            return NotFound(new { message = "Recenzia nu a fost gasita." });

        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid.TryParse(userIdStr, out var userId);
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && review.UserId != userId)
            return Forbid();

        await _reviews.DeleteAsync(id);
        return NoContent();
    }
}
