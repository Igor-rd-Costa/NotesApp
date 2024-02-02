



using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace webapi.Models
{
    public class NoteSettings
    {
        public int Id { get; set; }
        public int NoteId { get; set; }
        public string MarginFormat { get; set; } = "px";
        public decimal MarginLeft { get; set; } = 0;
        public decimal MarginRight { get; set; } = 0;
        public decimal MarginTop { get; set; } = 0;
        public decimal MarginBottom { get; set; } = 0;
        public string BackgroundColor {  get; set; } = "#FFFFFFFF";
    }
}