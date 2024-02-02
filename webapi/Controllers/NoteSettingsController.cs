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
        private readonly NoteSettingsContext m_NoteSettingsContext;
        private readonly NotesContext m_NotesContext;
        private readonly UserManager<IdentityUser<int>> m_UserManager;

        public NoteSettingsController(NoteSettingsContext noteSettingsContext, NotesContext notesContext, UserManager<IdentityUser<int>> userManager)
        {
            m_NoteSettingsContext = noteSettingsContext;
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
            var obj = new
            {
                id = 42,
                guid = "",
            };
            var note = m_NotesContext.notes.Select(obj => new { Id = obj.Id, Guid = obj.Guid }).Where(note => note.Guid == guid).FirstOrDefault();
            if (note == null)
            {
                return NotFound();
            }
            Console.WriteLine($"Found Note: Id: {note.Id}, Guid: {note.Guid}");
            NoteSettings? noteSettings = m_NoteSettingsContext.note_settings.Where(ns => ns.NoteId == note.Id).FirstOrDefault();
            if (noteSettings == null )
            {
                return NotFound("No settings available!");
            }
            return Ok(noteSettings);
        }

        [HttpPut("update")]
        public IActionResult Update([FromBody] NoteSettingUpdateInfo updateInfo)
        {
            Console.WriteLine("Update request for note " + updateInfo.Guid + ":\nProperty: " + updateInfo.Property + "\nNew Value: " + updateInfo.NewValue);
            string? userId = m_UserManager.GetUserId(User);
            if (userId == null)
                return NotFound();

            int noteId = m_NotesContext.notes.Where(note => note.UserId == int.Parse(userId) && note.Guid == updateInfo.Guid).Select(note => note.Id).FirstOrDefault();
            NoteSettings? settings = m_NoteSettingsContext.note_settings.Where(ns => ns.NoteId == noteId).FirstOrDefault();
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
                    Console.WriteLine("Updated margin left!");
                    settings.MarginLeft = decimal.Parse(updateInfo.NewValue);
                } break;
                case "marginRight":
                {
                    settings.MarginRight = decimal.Parse(updateInfo.NewValue);
                }
                break;
                case "marginTop":
                {
                    settings.MarginTop = decimal.Parse(updateInfo.NewValue);
                }
                break;
                case "marginBottom":
                {
                    settings.MarginBottom = decimal.Parse(updateInfo.NewValue);
                }
                break;
                case "backgroundColor":
                {
                    settings.BackgroundColor = updateInfo.NewValue;
                } break;
            }

            m_NoteSettingsContext.note_settings.Update(settings);
            m_NoteSettingsContext.SaveChanges();
            return Ok(true);
        }
    }
}
