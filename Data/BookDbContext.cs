using Microsoft.EntityFrameworkCore;
using BookMvcApp.Models;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

namespace BookMvcApp.Data
{
    public sealed class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
        {
            try
            {
                var databaseCreator = (RelationalDatabaseCreator)Database.GetService<IDatabaseCreator>();

                if (!databaseCreator.Exists()) databaseCreator.Create();
                if (!databaseCreator.HasTables()) databaseCreator.CreateTables();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public DbSet<Book> Books { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed some sample data
            modelBuilder.Entity<Book>().HasData(
                new Book
                {
                    Id = 1,
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald",
                    Genre = "Fiction",
                    PublishedDate = new DateTime(1925, 4, 10),
                    IsRead = true
                },
                new Book
                {
                    Id = 2,
                    Title = "To Kill a Mockingbird",
                    Author = "Harper Lee",
                    Genre = "Fiction",
                    PublishedDate = new DateTime(1960, 7, 11),
                    IsRead = false
                },
                new Book
                {
                    Id = 3,
                    Title = "1984",
                    Author = "George Orwell",
                    Genre = "Dystopian Fiction",
                    PublishedDate = new DateTime(1949, 6, 8),
                    IsRead = true
                }
            );
        }
    }
}
