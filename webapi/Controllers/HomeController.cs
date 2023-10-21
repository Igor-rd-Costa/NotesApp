using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;
using System.Security.Claims;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("")]
    [Authorize(AuthenticationSchemes = "Identity.Application")]
    public class HomeController : ControllerBase
    {
        private readonly NotesContext m_NotesContext;
        private readonly UserManager<IdentityUser<int>> m_UserManager;
        private readonly SignInManager<IdentityUser<int>> m_SignInManager;

        public HomeController(NotesContext context, UserManager<IdentityUser<int>> userManager, SignInManager<IdentityUser<int>> signInManager) 
        {
            m_NotesContext = context;
            m_UserManager = userManager;
            m_SignInManager = signInManager;
        }

        [HttpGet]
        public List<NotePreview> Get()
        {
            if (m_NotesContext.notes != null)
            {
                var notes = m_NotesContext.notes.Select(note => new NotePreview
                {
                    Id = note.Id,
                    Name = note.Name,
                    ModifyDate = note.Modify_Date,
                    Preview = note.Content
                }).ToList();
                return notes;
            }
            return new List<NotePreview>();
        }

        [HttpGet("count")]
        public int Count()
        {
            return m_NotesContext.notes.Count();
        }
    }
}
