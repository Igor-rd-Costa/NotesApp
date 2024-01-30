using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class NoteSettingsContext : DbContext
    {
        public NoteSettingsContext(DbContextOptions<NoteSettingsContext> options) 
            : base(options)
        { }

        public DbSet<NoteSettings> note_settings { get; set; } = default!;
    }

}