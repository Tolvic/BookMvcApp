using System.ComponentModel.DataAnnotations;

namespace BookMvcApp.Models
{
    public class Book
    {
        public int Id { get; init; }

        [Required]
        [StringLength(200)]
        public string Title { get; init; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Author { get; init; } = string.Empty;

        [StringLength(50)]
        public string? Genre { get; init; }

        [Display(Name = "Published Date")]
        public DateTime? PublishedDate { get; init; }

        [Display(Name = "Read")]
        public bool IsRead { get; init; }
    }
}
