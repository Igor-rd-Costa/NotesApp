namespace webapi.Types
{
    public class NoteSettingsCardInfo
    {
        public Guid Guid { get; set; }
        public string Name { get; set; } = "";
        public DateTime CreateDate { get; set; }
        public DateTime ModifyDate { get; set; }
    }
}