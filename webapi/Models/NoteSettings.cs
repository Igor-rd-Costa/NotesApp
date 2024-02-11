



using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace webapi.Models
{
    [PrimaryKey("Id")]
    public class NoteSettings
    {
        public int Id { get; set; }
        [ForeignKey("Note")]
        public int NoteId { get; set; }
        public string MarginFormat { get; set; } = "px";
        public decimal MarginLeft { get; set; } = 0;
        public decimal MarginRight { get; set; } = 0;
        public decimal MarginTop { get; set; } = 0;
        public decimal MarginBottom { get; set; } = 0;
        [StringLength(9)]
        public string BackgroundColor {  get; set; } = "#FFFFFFFF";

        [JsonIgnore]
        public Note Note { get; set; }
    }
}