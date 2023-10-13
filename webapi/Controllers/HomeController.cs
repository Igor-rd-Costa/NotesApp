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
        private readonly NotesContext _dbContext;
        public HomeController(NotesContext context) 
        {
            _dbContext = context;
        }

        [HttpGet]
        public List<NotePreview> Get()
        {
            if (_dbContext.notes != null)
            {
                var notes = _dbContext.notes.Select(note => new NotePreview
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
            return _dbContext.notes.Count();
        }
    }
}
