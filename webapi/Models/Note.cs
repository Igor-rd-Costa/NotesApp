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

    public class NoteInfo
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public string Content { get; set; } = "";
        public DateTime Date { get; set; }
    }

    public class NotePreview
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime ModifyDate { get; set; }
        public string Preview { get; set; } = "";
    }

    public class NoteRenameInfo
    {
        public Guid Id { get; set; }
        public string NewName { get; set; } = "";
    }

    public class NoteUpdateInfo
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = "";
    }
    public class NoteDeleteInfo
    {
        public Guid Id { get; set; }
    }

}
