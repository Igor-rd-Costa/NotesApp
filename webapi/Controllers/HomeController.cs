using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;
using System.Xml.Linq;
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
        private readonly NotesAppContext m_NoteContext;
        private readonly UserManager<User> m_UserManager;
        private readonly SignInManager<User> m_SignInManager;

        public HomeController(NotesAppContext noteContext,
            UserManager<User> userManager, SignInManager<User> signInManager) 
        {
            m_NoteContext = noteContext;
            m_UserManager = userManager;
            m_SignInManager = signInManager;
        }

        [HttpGet]
        public IActionResult Previews()
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var ids = m_NoteContext.notes.Where(note => note.UserId == int.Parse(userId)).Select(nt => nt.Id).ToList();
            var notes = m_NoteContext.notes.Where(note => note.UserId == int.Parse(userId)).Select(note => new
            {
                Preview = new NotePreview
                {
                    Guid = note.Guid,
                    Name = note.Name,
                    ModifyDate = note.ModifyDate,
                    Preview = note.Content
                },
                Settings = m_NoteContext.note_settings.Where(ns => ns.NoteId == note.Id).FirstOrDefault()
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
            NoteSettings? settings = m_NoteContext.note_settings.Where(ns => ns.NoteId == note.Id).FirstOrDefault();
            if (settings == null) 
            {
                return NotFound();
            }

            Console.WriteLine("Got Hereeee!");
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
            NoteSettings settings = m_NoteContext.note_default_settings.Where(nds => nds.UserId == id).Select(nds => new NoteSettings
            {
                NoteId = note.Id,
                MarginFormat = nds.MarginFormat,
                MarginLeft = nds.MarginLeft,
                MarginRight = nds.MarginRight,
                MarginBottom = nds.MarginBottom,
                MarginTop = nds.MarginTop,
                BackgroundColor = nds.BackgroundColor
            }).First();
            var res = m_NoteContext.Add(settings);
            if (res.State != EntityState.Added)
            {
                //TODO delete note that was created
                return BadRequest("Could not create note settings!");
            }
            m_NoteContext.SaveChanges();
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

            NoteSettings? noteSettings = m_NoteContext.note_settings.Where(ns => note.Id == ns.NoteId).FirstOrDefault();
            if (noteSettings != null)
            {
                m_NoteContext.note_settings.Remove(noteSettings);
                m_NoteContext.SaveChanges();
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
                NoteSettings? noteSettings = m_NoteContext.note_settings.Where(ns => note.Id == ns.NoteId).FirstOrDefault();
                if (noteSettings != null)
                {
                    m_NoteContext.Remove(noteSettings);
                    m_NoteContext.SaveChanges();
                }
                m_NoteContext.notes.Remove(note);
                m_NoteContext.SaveChanges();
            }

            return Ok();
        }
    }
}
