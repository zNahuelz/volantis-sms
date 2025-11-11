namespace api.Data.Seeders
{
    public interface ISeeder
    {
        Task SeedAsync(IServiceProvider serviceProvider);
    }
}
