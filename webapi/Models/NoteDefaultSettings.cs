using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace webapi.Models
{
    [PrimaryKey("Id")]
    public class NoteDefaultSettings
    {
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public string MarginFormat { get; set; } = "px";
        public decimal MarginLeft { get; set; } = 0;
        public decimal MarginRight { get; set; } = 0;
        public decimal MarginTop { get; set; } = 0;
        public decimal MarginBottom { get; set; } = 0;
        [StringLength(9)]
        public string BackgroundColor { get; set; } = "#FFFFFFFF";
        
        [JsonIgnore]
        public User User { get; set; }
    }
}
