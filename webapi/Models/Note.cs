using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class Note
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        [DataType(DataType.Date)]
        public DateTime Creation_Date { get; set; }
        [DataType(DataType.Date)]
        public DateTime Modify_Date { get; set; }

        public string? Content { get; set; }
    }
}
