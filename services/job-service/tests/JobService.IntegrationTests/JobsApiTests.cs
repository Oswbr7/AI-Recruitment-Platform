using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;

namespace JobService.IntegrationTests;

/// <summary>
/// job-service a través de HTTP real: creación (envelope), validación
/// (400 vía ValidationBehavior), transición de estado (publish) y contrato
/// de paginación (items/totalCount/totalPages).
/// </summary>
public class JobsApiTests : IDisposable
{
    private static readonly JsonSerializerOptions Json = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private readonly JobServiceApiFactory _factory = new();
    private readonly HttpClient _client;

    public JobsApiTests()
    {
        _client = _factory.CreateClient();
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", CreateToken());
    }

    public void Dispose()
    {
        _client.Dispose();
        _factory.Dispose();
    }

    private static string CreateToken()
    {
        // Mismos valores que el UseSetting del factory: cualquier servicio
        // que valide con el secreto compartido acepta este token.
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("IntegrationTestSecretKey_Min32Chars!"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            "RecruitmentPlatform",
            "RecruitmentPlatform",
            new[] { new Claim("sub", Guid.NewGuid().ToString()), new Claim("role", "Recruiter") },
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<Guid> CreateJob(string title)
    {
        var response = await _client.PostAsJsonAsync("/api/jobs", new
        {
            title,
            description = "Vacante de integración",
            department = "Engineering",
            location = "Guadalajara",
            employmentType = "FullTime",
            experienceLevel = "MidLevel",
            remoteType = "Remote",
            salaryMin = 30000,
            salaryMax = 50000,
            currency = "MXN",
        }, Json);

        response.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return doc.RootElement.GetProperty("data").GetProperty("id").GetGuid();
    }

    [Fact]
    public async Task Create_ValidJob_ReturnsEnvelopeWithId()
    {
        var id = await CreateJob("Backend Developer");

        Assert.NotEqual(Guid.Empty, id);
    }

    [Fact]
    public async Task Create_EmptyTitle_Returns400()
    {
        var response = await _client.PostAsJsonAsync("/api/jobs", new
        {
            title = "",
            description = "Desc",
            department = "Engineering",
            location = "Guadalajara",
            employmentType = "FullTime",
            experienceLevel = "MidLevel",
            remoteType = "Remote",
        }, Json);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_Publish_GetById_ShowsPublished()
    {
        var id = await CreateJob("Frontend Developer");

        var publish = await _client.PostAsync($"/api/jobs/{id}/publish", null);
        Assert.Equal(HttpStatusCode.OK, publish.StatusCode);

        var get = await _client.GetAsync($"/api/jobs/{id}");
        get.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(await get.Content.ReadAsStringAsync());

        Assert.Equal("Published", doc.RootElement.GetProperty("data").GetProperty("status").GetString());
    }

    [Fact]
    public async Task GetJobs_ReturnsPagedEnvelope()
    {
        await CreateJob("Vacante paginada 1");
        await CreateJob("Vacante paginada 2");

        var response = await _client.GetAsync("/api/jobs?page=1&pageSize=10");
        response.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

        var data = doc.RootElement.GetProperty("data");
        Assert.Equal(2, data.GetProperty("totalCount").GetInt32());
        Assert.True(data.GetProperty("items").GetArrayLength() == 2);
        Assert.True(data.GetProperty("totalPages").GetInt32() >= 1);
    }
}
