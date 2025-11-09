namespace volantis_sms.Data.Seeders
{
    public interface ISeeder
    {
        Task SeedAsync(IServiceProvider serviceProvider);
    }
}
