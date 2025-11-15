namespace api.DTOs
{
    public class SupplierListQuery
    {
        public string? Search { get; set; }
        public string? Field { get; set; } // name, ruc, id
        public string? Status { get; set; }
        public string? SortBy { get; set; }
        public string? SortDir { get; set; }
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 10;
    }
}
