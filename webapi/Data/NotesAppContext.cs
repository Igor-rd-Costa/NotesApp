using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class NotesAppContext : DbContext
    {
        public NotesAppContext (DbContextOptions<NotesAppContext> options) 
            : base(options)
        { }

        public DbSet<NoteDefaultSettings> note_default_settings { get; set; } = default!;
        public DbSet<NoteSettings> note_settings { get; set; } = default!;
        public DbSet<Note> notes { get; set; } = default!;
        public DbSet<User> users { get; set; }
    }
}
