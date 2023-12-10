using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace webapi.Data
{
    public class UserStore : IUserStore<IdentityUser<int>>, IUserPasswordStore<IdentityUser<int>>, IUserEmailStore<IdentityUser<int>>
    {
        private readonly UsersContext m_UserContext;

        public UserStore(UsersContext userContext)
        {
            m_UserContext = userContext;
        }

        public Task<IdentityResult> CreateAsync(IdentityUser<int> user, CancellationToken cancellationToken)
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

        public Task<IdentityResult> DeleteAsync(IdentityUser<int> user, CancellationToken cancellationToken)
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

        public Task<IdentityUser<int>?> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                return m_UserContext.users.Where(user => user.NormalizedEmail == normalizedEmail).FirstOrDefault();
            });
        }

        public Task<IdentityUser<int>?> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                return m_UserContext.users.Where(user => user.Id == int.Parse(userId)).FirstOrDefault();
            });
        }

        public Task<IdentityUser<int>?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew<IdentityUser<int>?>(() =>
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

        public Task<string?> GetEmailAsync(IdentityUser<int> user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(IdentityUser<int> user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<string?> GetNormalizedEmailAsync(IdentityUser<int> user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<string?> GetNormalizedUserNameAsync(IdentityUser<int> user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => user.NormalizedUserName);
        }

        public Task<string?> GetPasswordHashAsync(IdentityUser<int> user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => user.PasswordHash);
        }

        public Task<string> GetUserIdAsync(IdentityUser<int> user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(user.Id.ToString);
        }

        public Task<string?> GetUserNameAsync(IdentityUser<int> user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                return user.UserName;
            });
        }

        public Task<bool> HasPasswordAsync(IdentityUser<int> user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task SetEmailAsync(IdentityUser<int> user, string? email, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.Email = email;
            });
        }

        public Task SetEmailConfirmedAsync(IdentityUser<int> user, bool confirmed, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.EmailConfirmed = true;
            });
        }

        public Task SetNormalizedEmailAsync(IdentityUser<int> user, string? normalizedEmail, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.NormalizedEmail = normalizedEmail;
            });
        }

        public Task SetNormalizedUserNameAsync(IdentityUser<int> user, string? normalizedName, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.NormalizedUserName = normalizedName;
            });
        }

        public Task SetPasswordHashAsync(IdentityUser<int> user, string? passwordHash, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.PasswordHash = passwordHash;
            });
        }

        public Task SetUserNameAsync(IdentityUser<int> user, string? userName, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.UserName = userName;
            });
        }

        public Task<IdentityResult> UpdateAsync(IdentityUser<int> user, CancellationToken cancellationToken)
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
