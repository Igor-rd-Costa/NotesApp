using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class NotePreview
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime ModifyDate { get; set; }
        public string Preview { get; set; } = "";
    }
}
