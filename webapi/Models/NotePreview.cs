using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class NotePreview
    {
        public int Id { get; set; }
        
        public string? Name { get; set; }

        [DataType(DataType.Date)]
        public DateTime ModifyDate { get; set; }
        
        public string? Preview { get; set; }
    }
}
