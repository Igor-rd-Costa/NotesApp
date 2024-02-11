using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql.Internal.TypeHandlers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace webapi.Models
{
    [Table("notes")]
    [PrimaryKey("Id")]
    public class Note
    {
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public Guid Guid {  get; set; }
        public string Name { get; set; } = "";
        [DataType(DataType.Date)]
        public DateTime CreationDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime ModifyDate { get; set; }
        public string Content { get; set; } = "";

        [JsonIgnore]
        public NoteSettings NoteSettings { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}
