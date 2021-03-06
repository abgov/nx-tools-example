using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;

namespace ReactDotnetExample.Access
{
  public static class AccessExtensions {
    internal static IServiceCollection AddAccessJwtAuthentication(
      this IServiceCollection services,
      AccessConfiguration configuration
    ) {

      services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(jwt => {
          jwt.Authority = new Uri(
              configuration.Url, 
              $"/auth/realms/{configuration.Realm}"
            ).AbsoluteUri;
          jwt.Audience = "react-dotnet-example-service";
        });

      return services;
    } 
  }
}
