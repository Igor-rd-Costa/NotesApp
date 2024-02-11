using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace webapi.Models
{
    [Table("users")]
    public class User : IdentityUser<int>
    {
        [JsonIgnore]
        public NoteDefaultSettings NoteDefaultSettings { get; set; }
        [JsonIgnore]
        public ICollection<Note> Notes { get; set; }
    }
}
