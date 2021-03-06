using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReactDotnetExample.Access;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ReactDotnetExample
{
  public class Startup
  {
    public IConfiguration Configuration { get; }
    
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddAccessJwtAuthentication(
          Configuration
            .GetSection("Adsp:Access")
            .Get<AccessConfiguration>()
        )
        .AddAuthorization()
        .AddControllers();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }

      app.UseRouting()
        .UseAuthentication()
        .UseAuthorization()
        .UseEndpoints(endpoints => 
          endpoints.MapControllers()
        );
    }
  }
}
