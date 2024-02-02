using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class NotesContext : DbContext
    {
        public NotesContext(DbContextOptions<NotesContext> options) 
            : base(options)
        { }

        public DbSet<Note> notes { get; set; } = default!;
        public DbSet<NoteSettings> note_settings { get; set; } = default!; 
    }
}
