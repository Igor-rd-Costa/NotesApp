using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;
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
        public IActionResult Previews()
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            var notes = m_NotesContext.notes.Where(note => note.UserId == int.Parse(userId)).Select(note => new NotePreview
            {
                Id = note.Guid,
                Name = note.Name,
                ModifyDate = note.ModifyDate,
                Preview = note.Content
            }).ToList();
            return Ok(notes);
        }

        [HttpGet("note/{guid:guid}")]
        public IActionResult Note(Guid guid)
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            NoteInfo? note = m_NotesContext.notes.Where(note => note.UserId == int.Parse(userId) && note.Guid == guid).Select(note => new NoteInfo
            {
                Id = note.Guid,
                Name = note.Name,
                Content = note.Content,
                Date = note.ModifyDate
            }).FirstOrDefault();

            return Ok(note);
        }

        [HttpGet("note/count")]
        public IActionResult Count()
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            return Ok(m_NotesContext.notes.Where(note => note.UserId == int.Parse(userId)).Count());
        }

        [HttpPost("note/create")]
        public IActionResult Create()
        {
            string temp = m_UserManager.GetUserId(User) ?? "";
            if (temp == "")
                return BadRequest();

            int id = int.Parse(temp);
            Guid noteGuid = Guid.NewGuid();
            DateTime date = DateTime.UtcNow;
            Note note = new Note()
            {
                UserId = id,
                Guid = noteGuid,
                CreationDate = date,
                ModifyDate = date,
            };
            var result = m_NotesContext.Add(note);
            if (result.State == EntityState.Added)
            {
                m_NotesContext.SaveChanges();
                return Ok(noteGuid);
            }
            return BadRequest();
        }

        [HttpPatch("note/rename")]
        public IActionResult Rename([FromBody] NoteRenameInfo renameInfo)
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            Note? note = m_NotesContext.notes.Where(note => note.UserId == int.Parse(userId) && note.Guid == renameInfo.Id).FirstOrDefault();
            if (note == null)
                return NotFound();

            note.Name = renameInfo.NewName;
            note.ModifyDate = DateTime.UtcNow;

            m_NotesContext.SaveChanges();
            return Ok();
        }

        [HttpPatch("note/update")]
        public IActionResult Update([FromBody] NoteUpdateInfo info)
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound("User not found!");

            Note? note = m_NotesContext.notes.Where(note => note.UserId == int.Parse(userId) && note.Guid == info.Id).FirstOrDefault();
            if (note == null)
                return NotFound("Note not found!");

            note.Content = info.Content;
            note.ModifyDate = DateTime.UtcNow;
            m_NotesContext.SaveChanges();
            return Ok();
        }

        [HttpDelete("note/delete")]
        public IActionResult Delete([FromBody] NoteDeleteInfo info)
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            Note? note = m_NotesContext.notes.Where(note => note.Guid == info.Id && note.UserId == int.Parse(userId)).FirstOrDefault();
            if (note == null)
                return NotFound();

            m_NotesContext.notes.Remove(note);
            m_NotesContext.SaveChanges();
            return Ok();
        }

        [HttpDelete("note/checkdelete")]
        public IActionResult CheckDelete([FromBody] NoteDeleteInfo info)
        {
            Console.WriteLine("Check Delete request!");
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            Note? note = m_NotesContext.notes.Where(note => note.Guid == info.Id && note.UserId == int.Parse(userId)).FirstOrDefault();
            if (note == null)
                return NotFound();

            Console.WriteLine("Create: " + note.CreationDate + "\nModify: " + note.ModifyDate);
            if (note.ModifyDate.Equals(note.CreationDate))
            {
                m_NotesContext.notes.Remove(note);
                m_NotesContext.SaveChanges();
            }

            return Ok();
        }
    }
}
