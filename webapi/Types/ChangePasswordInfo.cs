namespace webapi.Types
{
    public class ChangePasswordInfo
    {
        public string OldPassword { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }
}
