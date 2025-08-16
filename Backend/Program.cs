using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<ApplContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("IspitCS"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORS", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:5500",
                           "https://localhost:5500",
                           "http://127.0.0.1:5500",
                           "https://127.0.0.1:5500",
                           "http://localhost:4200")
              .AllowCredentials();
    });
});

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options=>{
        options.TokenValidationParameters= new TokenValidationParameters{
            ValidateIssuer=true,
            ValidateAudience=true,
            ValidateLifetime=true,
            ValidateIssuerSigningKey=true,
            ValidIssuer="http://localhost:4200",
            ValidAudience="http://localhost:4200",
            IssuerSigningKey= new SymmetricSecurityKey(Encoding.UTF8.GetBytes("OvoJeNasKljucZaEnkriptovanjeKojiUpravoIzmisljamDokPisemAkoNekoOvoCitaZasto?"))
        };
    });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CORS");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
