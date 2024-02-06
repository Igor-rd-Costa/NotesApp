namespace webapi.Models
{
    public class NoteDefaultSettings
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string MarginFormat { get; set; } = "px";
        public decimal MarginLeft { get; set; } = 0;
        public decimal MarginRight { get; set; } = 0;
        public decimal MarginTop { get; set; } = 0;
        public decimal MarginBottom { get; set; } = 0;
        public string BackgroundColor { get; set; } = "#FFFFFFFF";
    }
}
