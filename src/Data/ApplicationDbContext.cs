using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using volantis_sms.Models;

namespace volantis_sms.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser, ApplicationRole, string>(options)
    {
        public DbSet<Ability> Abilities => Set<Ability>();
        public DbSet<RoleAbility> RoleAbilities => Set<RoleAbility>();
        public DbSet<Store> Stores => Set<Store>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<StoreProduct> StoreProducts => Set<StoreProduct>();
        public DbSet<Presentation> Presentations => Set<Presentation>();
        public DbSet<Supplier> Suppliers => Set<Supplier>();
        public DbSet<BuyOrder> BuyOrders => Set<BuyOrder>();
        public DbSet<BuyOrderDetail> BuyOrderDetails => Set<BuyOrderDetail>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Sale> Sales => Set<Sale>();
        public DbSet<SaleDetail> SaleDetails => Set<SaleDetail>();
        public DbSet<VoucherType> VoucherTypes => Set<VoucherType>();
        public DbSet<VoucherSeries> VoucherSeries => Set<VoucherSeries>();
        public DbSet<PaymentType> PaymentTypes => Set<PaymentType>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>()
                .HasOne(u => u.Store)
                .WithMany(s => s.Users)
                .HasForeignKey(u => u.StoreId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<RoleAbility>()
                .HasKey(ra => new { ra.RoleId, ra.AbilityId });

            builder.Entity<RoleAbility>()
                .HasOne(ra => ra.Role)
                .WithMany(r => r.RoleAbilities)
                .HasForeignKey(ra => ra.RoleId);

            builder.Entity<RoleAbility>()
                .HasOne(ra => ra.Ability)
                .WithMany()
                .HasForeignKey(ra => ra.AbilityId);

            builder.Entity<ApplicationUser>()
                .HasOne(u => u.Store)
                .WithMany(s => s.Users)
                .HasForeignKey(u => u.StoreId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<StoreProduct>()
                .HasKey(sp => new { sp.StoreId, sp.ProductId });

            builder.Entity<StoreProduct>()
                .HasOne(sp => sp.Store)
                .WithMany(s => s.StoreProducts)
                .HasForeignKey(sp => sp.StoreId);

            builder.Entity<StoreProduct>()
                .HasOne(sp => sp.Product)
                .WithMany(p => p.StoreProducts)
                .HasForeignKey(sp => sp.ProductId);

            builder.Entity<Product>()
                .HasOne(p => p.Presentation)
                .WithMany(pr => pr.Products)
                .HasForeignKey(p => p.PresentationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<BuyOrder>()
                .HasOne(bo => bo.Store)
                .WithMany(s => s.BuyOrders)
                .HasForeignKey(bo => bo.StoreId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<BuyOrder>()
                .HasOne(bo => bo.Supplier)
                .WithMany(su => su.BuyOrders)
                .HasForeignKey(bo => bo.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<BuyOrderDetail>()
                .HasKey(bod => new { bod.BuyOrderId, bod.ProductId });

            builder.Entity<BuyOrderDetail>()
                .HasOne(bod => bod.BuyOrder)
                .WithMany(bo => bo.Details)
                .HasForeignKey(bod => bod.BuyOrderId);

            builder.Entity<BuyOrderDetail>()
                .HasOne(bod => bod.Product)
                .WithMany(p => p.BuyOrderDetails)
                .HasForeignKey(bod => bod.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Sale>()
                .HasOne(s => s.Customer)
                .WithMany(c => c.Sales)
                .HasForeignKey(s => s.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Sale>()
                .HasOne(s => s.Store)
                .WithMany()
                .HasForeignKey(s => s.StoreId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Sale>()
                .HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<SaleDetail>()
                .HasKey(sd => new { sd.SaleId, sd.ProductId });

            builder.Entity<SaleDetail>()
                .HasOne(sd => sd.Sale)
                .WithMany(s => s.Details)
                .HasForeignKey(sd => sd.SaleId);

            builder.Entity<SaleDetail>()
                .HasOne(sd => sd.Product)
                .WithMany()
                .HasForeignKey(sd => sd.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Sale>()
                .HasOne(s => s.VoucherType)
                .WithMany(vt => vt.Sales)
                .HasForeignKey(s => s.VoucherTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Sale>()
                .HasOne(s => s.VoucherSeries)
                .WithMany()
                .HasForeignKey(s => s.VoucherSeriesId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<VoucherSeries>()
                .HasOne(vs => vs.VoucherType)
                .WithMany(vt => vt.VoucherSeries)
                .HasForeignKey(vs => vs.VoucherTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Sale>()
                .HasOne(s => s.PaymentType)
                .WithMany(pt => pt.Sales)
                .HasForeignKey(s => s.PaymentTypeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

}
