using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("")]
    public class HomeController : ControllerBase
    {
        private readonly NotesContext m_NotesContext;
        public HomeController(NotesContext context) 
        {
            m_NotesContext = context;
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

        [HttpGet("/count")]
        public int Count()
        {
            return m_NotesContext.notes.Count();
        }
    }
}
