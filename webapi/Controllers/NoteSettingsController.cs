using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Data;
using webapi.Models;
using webapi.Types;

namespace webapi.Controllers
{
    [ApiController]
    [Route("settings")]
    [Authorize(AuthenticationSchemes = "Identity.Application")]
    public class NoteSettingsController : ControllerBase
    {
        private readonly NotesAppContext m_NotesContext;
        private readonly UserManager<User> m_UserManager;

        public NoteSettingsController(NotesAppContext notesContext, UserManager<User> userManager)
        {
            m_NotesContext = notesContext;
            m_UserManager = userManager;
        }

        [HttpGet("note/{guid:guid}")]
        public IActionResult NoteSettings(Guid guid) 
        {
            Console.WriteLine("NoteSettings request for note " + guid);
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
            {
                return Unauthorized();
            }
            var note = m_NotesContext.notes.Select(obj => new { Id = obj.Id, Guid = obj.Guid }).Where(note => note.Guid == guid).FirstOrDefault();
            if (note == null)
            {
                return NotFound();
            }
            Console.WriteLine($"Found Note: Id: {note.Id}, Guid: {note.Guid}");
            NoteSettings? noteSettings = m_NotesContext.note_settings.Where(ns => ns.NoteId == note.Id).FirstOrDefault();
            if (noteSettings == null )
            {
                return NotFound("No settings available!");
            }
            return Ok(noteSettings);
        }

        [HttpGet("default")]
        public IActionResult Default()
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            NoteDefaultSettings? nds = m_NotesContext.note_default_settings.Where(ns => ns.UserId == int.Parse(userId)).FirstOrDefault();
            if (nds == null)
            {
                return NotFound();
            }

            return Ok(nds);
        }

        [HttpPut("update")]
        public IActionResult Update([FromBody] NoteSettingUpdateInfo updateInfo)
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            int noteId = m_NotesContext.notes.Where(note => note.UserId == int.Parse(userId) && note.Guid == updateInfo.Guid).Select(note => note.Id).FirstOrDefault();
            NoteSettings? settings = m_NotesContext.note_settings.Where(ns => ns.NoteId == noteId).FirstOrDefault();
            if (settings == null)
            {
                return NotFound();
            }
            switch (updateInfo.Property)
            {
                case "marginFormat":
                {
                    settings.MarginFormat = updateInfo.NewValue;
                } break;
                case "marginLeft":
                {
                    settings.MarginLeft = decimal.Parse(updateInfo.NewValue);
                } break;
                case "marginRight":
                {
                    settings.MarginRight = decimal.Parse(updateInfo.NewValue);
                } break;
                case "marginTop":
                {
                    settings.MarginTop = decimal.Parse(updateInfo.NewValue);
                } break;
                case "marginBottom":
                {
                    settings.MarginBottom = decimal.Parse(updateInfo.NewValue);
                } break;
                case "backgroundColor":
                {
                    settings.BackgroundColor = updateInfo.NewValue;
                } break;
            }

            m_NotesContext.note_settings.Update(settings);
            m_NotesContext.SaveChanges();
            return Ok(true);
        }

        [HttpPut("default/update")]
        public IActionResult DefaultUpdate([FromBody] DefaultNoteSettingsUpdateInfo updateInfo)
        {
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            NoteDefaultSettings? nds = m_NotesContext.note_default_settings.Where(x => x.UserId == int.Parse(userId)).FirstOrDefault();
            if (nds == null)
                return NotFound();

            switch (updateInfo.Property)
            {
                case "marginFormat":
                {
                    nds.MarginFormat = updateInfo.NewValue;
                }
                break;
                case "marginLeft":
                {
                    nds.MarginLeft = decimal.Parse(updateInfo.NewValue);
                }
                break;
                case "marginRight":
                {
                    nds.MarginRight = decimal.Parse(updateInfo.NewValue);
                }
                break;
                case "marginTop":
                {
                    nds.MarginTop = decimal.Parse(updateInfo.NewValue);
                }
                break;
                case "marginBottom":
                {
                    nds.MarginBottom = decimal.Parse(updateInfo.NewValue);
                }
                break;
                case "backgroundColor":
                {
                    nds.BackgroundColor = updateInfo.NewValue;
                }
                break;
            }

            m_NotesContext.note_default_settings.Update(nds);
            m_NotesContext.SaveChanges();
            return Ok(true);
        }
    }
}
