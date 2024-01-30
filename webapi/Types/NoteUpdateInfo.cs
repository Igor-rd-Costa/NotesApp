namespace webapi.Types
{
    public class NoteUpdateInfo
    {
        public Guid Guid { get; set; }
        public string Content { get; set; } = "";
    }
}