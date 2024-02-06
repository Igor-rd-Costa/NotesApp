using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class NoteDefaultSettingsContext : DbContext
    {
        public NoteDefaultSettingsContext(DbContextOptions<NoteDefaultSettingsContext> options)
            : base(options)
        { }

        public DbSet<NoteDefaultSettings> note_default_settings { get; set; } = default!;
    }

}
