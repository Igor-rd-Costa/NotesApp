namespace webapi.Types
{
    public class NoteRenameInfo
    {
        public Guid Guid { get; set; }
        public string NewName { get; set; } = "";
    }
}