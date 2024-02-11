using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class UserStore : IUserStore<User>, IUserPasswordStore<User>, IUserEmailStore<User>
    {
        private readonly NotesAppContext m_UserContext;

        public UserStore(NotesAppContext userContext)
        {
            m_UserContext = userContext;
        }

        public Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.NormalizedEmail = user.Email?.ToUpper();
                user.LockoutEnd = DateTimeOffset.UtcNow;
                var entity = m_UserContext.users.Add(user);
                if (entity.State.Equals(EntityState.Added))
                {
                    m_UserContext.SaveChanges();
                    return IdentityResult.Success;
                }

                return IdentityResult.Failed();
            });
        }

        public Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                m_UserContext.Database.ExecuteSqlInterpolated($"CALL delete_account({user.Id})");
                m_UserContext.SaveChanges();
                return IdentityResult.Success;
            });
        }

        public void Dispose()
        {

        }

        public Task<User?> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                return m_UserContext.users.Where(user => user.NormalizedEmail == normalizedEmail).FirstOrDefault();
            });
        }

        public Task<User?> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                return m_UserContext.users.Where(user => user.Id == int.Parse(userId)).FirstOrDefault();
            });
        }

        public Task<User?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew<User?>(() =>
            {
                var result = m_UserContext.users.Where(user => user.NormalizedUserName == normalizedUserName);
                if (result.Count() > 0)
                {
                    var user = result.First();
                    return user;
                }
                return null;
            });
        }

        public Task<string?> GetEmailAsync(User user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(User user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<string?> GetNormalizedEmailAsync(User user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<string?> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => user.NormalizedUserName);
        }

        public Task<string?> GetPasswordHashAsync(User user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => user.PasswordHash);
        }

        public Task<string> GetUserIdAsync(User user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(user.Id.ToString);
        }

        public Task<string?> GetUserNameAsync(User user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                return user.UserName;
            });
        }

        public Task<bool> HasPasswordAsync(User user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task SetEmailAsync(User user, string? email, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.Email = email;
            });
        }

        public Task SetEmailConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.EmailConfirmed = true;
            });
        }

        public Task SetNormalizedEmailAsync(User user, string? normalizedEmail, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.NormalizedEmail = normalizedEmail;
            });
        }

        public Task SetNormalizedUserNameAsync(User user, string? normalizedName, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.NormalizedUserName = normalizedName;
            });
        }

        public Task SetPasswordHashAsync(User user, string? passwordHash, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.PasswordHash = passwordHash;
            });
        }

        public Task SetUserNameAsync(User user, string? userName, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.UserName = userName;
            });
        }

        public Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken)
        {
            return Task<IdentityResult>.Factory.StartNew(() =>
            {
                var existingUser = m_UserContext.users.Where(dbUser => dbUser.Id == user.Id).FirstOrDefault();
                if (existingUser == null)
                {
                    return IdentityResult.Failed();
                }

                existingUser = user;
                m_UserContext.SaveChanges();
                return IdentityResult.Success;
            });
        }
    }
}
