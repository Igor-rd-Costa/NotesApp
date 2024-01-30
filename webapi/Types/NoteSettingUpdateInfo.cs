namespace webapi.Types
{
    public class NoteSettingUpdateInfo
    {
        public Guid Guid { get; set; }
        public string Property { get; set; } = "";
        public string NewValue { get; set; } = "";
    }
}