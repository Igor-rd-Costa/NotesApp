namespace webapi.Models
{
    public class NoteInfo
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public string Content { get; set; } = "";
        public DateTime Date { get; set; }
    }
}
