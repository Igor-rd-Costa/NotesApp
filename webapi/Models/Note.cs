using Npgsql.Internal.TypeHandlers;
using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class Note
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public Guid Guid {  get; set; }

        public string Name { get; set; } = "";

        [DataType(DataType.Date)]
        public DateTime CreationDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime ModifyDate { get; set; }

        public string Content { get; set; } = "";
    }
}
