using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser<int>> m_UserManager;
        private readonly SignInManager<IdentityUser<int>> m_SignInManager;

        public AuthController(UserManager<IdentityUser<int>> userManager, SignInManager<IdentityUser<int>> signInManager)
        {
            m_UserManager = userManager;
            m_SignInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginInfo info)
        {
            Microsoft.AspNetCore.Identity.SignInResult result = await m_SignInManager.PasswordSignInAsync(info.Username, info.Password, false, false);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest();
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
            IdentityUser<int> user = new()
            {
                UserName = info.Username,
                Email = info.Email
            };
            IdentityResult result = await m_UserManager.CreateAsync(user, info.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            Microsoft.AspNetCore.Identity.SignInResult signInResult = await m_SignInManager.PasswordSignInAsync(info.Username, info.Password, false, false);
            if (signInResult.Succeeded)
            {
                return Ok();
            }
            return BadRequest("Failed to SignIn after registration!");
        }

        [HttpGet("islogged")]
        public bool IsLogged()
        {
            return m_SignInManager.IsSignedIn(User);
        }

        [HttpGet("username")]
        public string Username()
        {
            if (User.Identity == null)
                return "";

            return User.Identity.Name ?? "";
        }
    }
}
