using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("suppliers")]
    public class SupplierController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SupplierController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Policy = "CanListSuppliers")]
        [HttpGet]
        public async Task<ActionResult<PaginatedResponse<Supplier>>> GetSuppliers([FromQuery] SupplierListQuery query)
        {
            var suppliers = _context.Suppliers.AsQueryable();

            suppliers = query.Status?.ToLower() switch
            {
                "enabled" => suppliers.Where(s => s.DeletedAt == null),
                "disabled" => suppliers.Where(s => s.DeletedAt != null),
                _ => suppliers
            };

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var term = query.Search.Trim().ToLower();

                suppliers = query.Field?.ToLower() switch
                {
                    "name" => suppliers.Where(s => s.Name.ToLower().Contains(term)),
                    "ruc" => suppliers.Where(s => s.Ruc.ToLower().Contains(term)),
                    "id" => int.TryParse(term, out var id)
                                ? suppliers.Where(s => s.Id == id)
                                : suppliers.Where(s => false),
                    _ => suppliers
                };
            }

            var totalItems = await suppliers.CountAsync();

            var sortBy = string.IsNullOrWhiteSpace(query.SortBy) ? "Id" : query.SortBy;

            suppliers = query.SortDir?.ToLower() == "desc"
                ? suppliers.OrderByDescending(e => EF.Property<object>(e, sortBy))
                : suppliers.OrderBy(e => EF.Property<object>(e, sortBy));

            var data = await suppliers
                .Skip((query.Page - 1) * query.Limit)
                .Take(query.Limit)
                .ToListAsync();

            var totalPages = (int)Math.Ceiling(totalItems / (double)query.Limit);

            return Ok(new PaginatedResponse<Supplier>
            {
                Data = data,
                TotalItems = totalItems,
                TotalPages = totalPages,
                Page = query.Page,
                Limit = query.Limit
            });
        }
    }
}
