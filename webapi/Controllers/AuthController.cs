using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Data;
using webapi.Models;
using webapi.Types;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace webapi.Controllers
{
    enum FormErrorCodes
    {
        USERNAME_TAKEN =            0b0000000001, 
        EMAIL_TAKEN =               0b0000000010, 
        PASSWORD_SHORT =            0b0000000100, 
        PASSWORD_NO_ALPHANUMERIC =  0b0000001000, 
        PASSWORD_NO_DIGIT =         0b0000010000, 
        PASSWORD_NO_UPPER =         0b0000100000,
        PASSWORD_NO_LOWER =         0b0001000000,
        INVALID_USERNAME =          0b0010000000,
        INVALID_EMAIL =             0b0100000000,
        INVALID_PASSWORD =          0b1000000000
    }

    [ApiController]
    [Route("/auth")]
    public class AuthController : ControllerBase
    {
        private readonly NotesAppContext m_NoteContext;
        private readonly UserManager<User> m_UserManager;
        private readonly SignInManager<User> m_SignInManager;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager , NotesAppContext noteContext)
        {
            m_UserManager = userManager;
            m_SignInManager = signInManager;
            m_NoteContext = noteContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginInfo info)
        {
            Microsoft.AspNetCore.Identity.SignInResult result = await m_SignInManager.PasswordSignInAsync(info.Username, info.Password, false, false);
            if (result.Succeeded)
            {
                return Ok();
            }
            return Unauthorized();
        }

        [HttpPost("logout")]
        public async Task<bool> Logout()
        {
            await m_SignInManager.SignOutAsync();
            return true;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterInfo info)
        {
            User user = new()
            {
                UserName = info.Username,
                Email = info.Email,
            };
            IdentityResult result = await m_UserManager.CreateAsync(user, info.Password);
            if (!result.Succeeded)
            {
                int registerError = 0;
                foreach (IdentityError error in result.Errors)
                {
                    registerError |= (int)ErrorCodeToFormErrorCode(error.Code);
                }
                return BadRequest(registerError);
            }
            Console.WriteLine("CREATED USER WITH ID: " + user.Id);
            NoteDefaultSettings nds = new()
            {
                UserId = user.Id,
            };
            m_NoteContext.note_default_settings.Add(nds);
            m_NoteContext.SaveChanges();
            Microsoft.AspNetCore.Identity.SignInResult signInResult = await m_SignInManager.PasswordSignInAsync(info.Username, info.Password, false, false);
            if (signInResult.Succeeded)
            {
                return Ok();
            }
            return BadRequest("Failed to sign in after registration!");
        }

        [HttpGet("is-logged")]
        public bool IsLogged()
        {
            return m_SignInManager.IsSignedIn(User);
        }


        [HttpGet("get-username")]
        public string GetUsername()
        {
            string? username = m_UserManager.GetUserName(User);

            if (username == null)
                return "";

            return username;
        }

        [HttpGet("get-email")]
        public async Task<IActionResult> GetEmail()
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            string? email = await m_UserManager.GetEmailAsync(user);

            if (email == null)
            {
                Console.WriteLine("G:Email is null!");
                return BadRequest();
            }

            return Ok(email);
        }


        [HttpGet("check-username/{username}")]
        public async Task<IActionResult> CheckUsername(string username)
        {
            User? user = await m_UserManager.FindByNameAsync(username);
            if (user != null)
            {
                return Ok(false);
            }
            return Ok(true);
        }

        [HttpGet("check-email/{email}")]
        public async Task<IActionResult> CheckEmail(string email)
        {
            User? user = await m_UserManager.FindByEmailAsync(email);
            if (user != null)
            {
                return Ok(false);
            }
            return Ok(true);
        }


        [HttpPost("check-password")]
        public async Task<IActionResult> CheckPassword([FromBody] CheckPasswordInfo info)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
            {
                return BadRequest();
            }

            bool isPasswordValid = await m_UserManager.CheckPasswordAsync(user, info.Password);
            return Ok(isPasswordValid);
        }

        [HttpPatch("change-username")]
        public async Task<IActionResult> ChangeUsername([FromBody] ChangeUsernameInfo info)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
            {
                return BadRequest();
            }
            IdentityResult result = await m_UserManager.SetUserNameAsync(user, info.Username);
            if (!result.Succeeded)
            {
                return BadRequest();
            }

            await m_SignInManager.RefreshSignInAsync(user);

            return Ok();
        }

        [HttpPatch("change-email")]
        public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailInfo info)
        {
            Console.WriteLine("Recieved email " + info.Email);
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
            {
                Console.WriteLine("User is null!");
                return BadRequest();
            }
            IdentityResult result = await m_UserManager.SetEmailAsync(user, info.Email);
            if (!result.Succeeded)
            {
                Console.WriteLine("Errors: " + info.Email);
                foreach (IdentityError error in result.Errors)
                {
                    Console.WriteLine(error.Code);
                }


                return BadRequest();
            }

            await m_SignInManager.RefreshSignInAsync(user);

            return Ok();
        }

        [HttpPatch("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordInfo info)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return BadRequest(0);

            IdentityResult result = await m_UserManager.ChangePasswordAsync(user, info.OldPassword, info.NewPassword);
            if (!result.Succeeded)
            {
                int errorCode = 0;
                foreach (IdentityError error in result.Errors)
                {
                    errorCode |= (int)ErrorCodeToFormErrorCode(error.Code);
                }
                return BadRequest(errorCode);
            }
            return Ok();
        }

        [HttpDelete("delete-account")]
        public async Task<IActionResult> DeleteAccount()
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
            {
                return BadRequest();
            }

            IdentityResult result = await m_UserManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest();
            }
            await m_SignInManager.SignOutAsync();
            return Ok();
        }

        private FormErrorCodes ErrorCodeToFormErrorCode(string errorCode)
        {
            switch (errorCode)
            {
                case "DuplicateUserName": return FormErrorCodes.USERNAME_TAKEN;
                case "DuplicateEmail": return FormErrorCodes.EMAIL_TAKEN;
                case "PasswordTooShort": return FormErrorCodes.PASSWORD_SHORT;
                case "PasswordRequiresNonAlphanumeric": return FormErrorCodes.PASSWORD_NO_ALPHANUMERIC;
                case "PasswordRequiresDigit": return FormErrorCodes.PASSWORD_NO_DIGIT;
                case "PasswordRequiresUpper": return FormErrorCodes.PASSWORD_NO_UPPER;
                case "PasswordRequiresLower": return FormErrorCodes.PASSWORD_NO_LOWER;
                case "InvalidUserName": return FormErrorCodes.INVALID_USERNAME;
                case "InvalidEmail": return FormErrorCodes.INVALID_EMAIL;
                case "PasswordMismatch": return FormErrorCodes.INVALID_PASSWORD;
                default:
                {
                    Console.WriteLine("Unhandled register error: " + errorCode);
                    return 0;
                }
            }
        }
    }
}
