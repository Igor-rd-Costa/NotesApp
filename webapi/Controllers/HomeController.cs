using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;
using webapi.Data;
using webapi.Models;
using webapi.Types;

namespace webapi.Controllers
{
    [ApiController]
    [Route("")]
    [Authorize(AuthenticationSchemes = "Identity.Application")]
    public class HomeController : ControllerBase
    {
        private readonly NotesContext m_NoteContext;
        private readonly NoteSettingsContext m_NoteSettingsContext;
        private readonly UserManager<IdentityUser<int>> m_UserManager;
        private readonly SignInManager<IdentityUser<int>> m_SignInManager;

        public HomeController(NotesContext noteContext, NoteSettingsContext noteSettingsContext,
            UserManager<IdentityUser<int>> userManager, SignInManager<IdentityUser<int>> signInManager) 
        {
            m_NoteContext = noteContext;
            m_NoteSettingsContext = noteSettingsContext;
            m_UserManager = userManager;
            m_SignInManager = signInManager;
        }

        [HttpGet]
        public IActionResult Previews()
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var notes = m_NoteContext.notes.Where(note => note.UserId == int.Parse(userId)).Select(note => new NotePreview
            {
                Guid = note.Guid,
                Name = note.Name,
                ModifyDate = note.ModifyDate,
                Preview = note.Content
            }).ToList();
            return Ok(notes);
        }

        [HttpGet("notes-settings-cards")]
        public IActionResult NoteSettingsCards()
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var notes = m_NoteContext.notes.Where(note => note.UserId == int.Parse(userId)).Select(note => new NoteSettingsCardInfo
            {
                Guid = note.Guid,
                Name = note.Name,
                CreateDate = note.CreationDate,
                ModifyDate = note.ModifyDate
            }).ToList();

            return Ok(notes);
        }

        [HttpGet("note/{guid:guid}")]
        public IActionResult Note(Guid guid)
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            Note? note = m_NoteContext.notes.Where(note => note.UserId == int.Parse(userId) && note.Guid == guid).FirstOrDefault();
            if (note == null)
            {
                return NotFound();
            }
            NoteSettings? settings = m_NoteSettingsContext.note_settings.Where(ns => ns.NoteId == note.Id).FirstOrDefault();
            if (settings == null) 
            {
                return NotFound();
            }
            return Ok(new {note, settings});
        }

        [HttpGet("note/count")]
        public IActionResult Count()
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            return Ok(m_NoteContext.notes.Where(note => note.UserId == int.Parse(userId)).Count());
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
            Note note = new()
            {   
                UserId = id,
                Guid = noteGuid,
                CreationDate = date,
                ModifyDate = date,
            };
            var result = m_NoteContext.Add(note);
            if (result.State != EntityState.Added)
            {
                return BadRequest();
            }
            m_NoteContext.SaveChanges();
            NoteSettings settings = new()
            {
                NoteId = note.Id
            };
            var res = m_NoteSettingsContext.Add(settings);
            if (res.State != EntityState.Added)
            {
                //TODO delete note that was created
                return BadRequest("Could not create note settings!");
            }
            m_NoteSettingsContext.SaveChanges();
            return Ok(noteGuid);
        }

        [HttpPatch("note/rename")]
        public IActionResult Rename([FromBody] NoteRenameInfo renameInfo)
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            Note? note = m_NoteContext.notes.Where(note => note.UserId == int.Parse(userId) && note.Guid == renameInfo.Guid).FirstOrDefault();
            if (note == null)
                return NotFound();

            note.Name = renameInfo.NewName;
            note.ModifyDate = DateTime.UtcNow;

            m_NoteContext.SaveChanges();
            return Ok();
        }

        [HttpPatch("note/update")]
        public IActionResult Update([FromBody] NoteUpdateInfo info)
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound("User not found!");

            Note? note = m_NoteContext.notes.Where(note => note.UserId == int.Parse(userId) && note.Guid == info.Guid).FirstOrDefault();
            if (note == null)
                return NotFound("Note not found!");

            note.Content = info.Content;
            note.ModifyDate = DateTime.UtcNow;
            m_NoteContext.SaveChanges();
            return Ok();
        }

        [HttpDelete("note/delete")]
        public IActionResult Delete([FromBody] NoteDeleteInfo info)
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            Note? note = m_NoteContext.notes.Where(note => note.Guid == info.Guid && note.UserId == int.Parse(userId)).FirstOrDefault();
            if (note == null)
                return NotFound();

            NoteSettings? noteSettings = m_NoteSettingsContext.note_settings.Where(ns => note.Id == ns.NoteId).FirstOrDefault();
            if (noteSettings != null)
            {
                m_NoteSettingsContext.note_settings.Remove(noteSettings);
                m_NoteSettingsContext.SaveChanges();
            }
            m_NoteContext.notes.Remove(note);
            m_NoteContext.SaveChanges();
            return Ok();
        }

        [HttpDelete("note/checkdelete")]
        public IActionResult CheckDelete([FromBody] NoteDeleteInfo info)
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            Note? note = m_NoteContext.notes.Where(note => note.Guid == info.Guid && note.UserId == int.Parse(userId)).FirstOrDefault();
            if (note == null)
                return NotFound();

            if (note.ModifyDate.Equals(note.CreationDate))
            {
                NoteSettings? noteSettings = m_NoteSettingsContext.note_settings.Where(ns => note.Id == ns.NoteId).FirstOrDefault();
                if (noteSettings != null)
                {
                    m_NoteSettingsContext.Remove(noteSettings);
                    m_NoteSettingsContext.SaveChanges();
                }
                m_NoteContext.notes.Remove(note);
                m_NoteContext.SaveChanges();
            }

            return Ok();
        }
    }
}
