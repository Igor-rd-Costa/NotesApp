using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

namespace webapi.Data
{
    public class UserStore : IUserStore<IdentityUser<int>>, IUserPasswordStore<IdentityUser<int>>
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
            throw new NotImplementedException();
        }

        public void Dispose()
        {

        }

        public Task<IdentityUser<int>?> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
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
                Console.WriteLine("Action!!");
                user.PasswordHash = passwordHash;
            });
        }

        public Task SetUserNameAsync(IdentityUser<int> user, string? userName, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<IdentityResult> UpdateAsync(IdentityUser<int> user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
