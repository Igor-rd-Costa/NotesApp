namespace webapi.Types
{
    public class NotePreview
    {
        public Guid Guid { get; set; }
        public string Name { get; set; } = "";
        public DateTime ModifyDate { get; set; }
        public string Preview { get; set; } = "";
    }
}