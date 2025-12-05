using Persistence;
var builder = WebApplication.CreateBuilder(args);

//add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
    });
});


// Add services to the container.
/*
ReferenceHandler.IgnoreCycles: Prevents JSON serialization errors when Entity Framework navigation properties create circular references
Without this, you'll get a "possible object cycle detected" error when returning orders with their order items

The serializer will automatically skip any properties that would create an infinite loop

SuppressModelStateInvalidFilter: Disables ASP.NET Core's automatic 400 Bad Request response for validation errors
This allows our controller to manually check ModelState.IsValid and return 422 Unprocessable Entity instead

422 is the semantically correct status code for validation errors (invalid data format)

*/
builder.Services.AddOpenApi();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
})
    .ConfigureApiBehaviorOptions(options =>
    {
        //Disable automatic 400 response so we can return 422 validation errors
        options.SuppressModelStateInvalidFilter = true;
    });

builder.Services.AddDbContext<DataContext>();

var app = builder.Build();

//use CORS
app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();

app.MapControllers();
app.Run();