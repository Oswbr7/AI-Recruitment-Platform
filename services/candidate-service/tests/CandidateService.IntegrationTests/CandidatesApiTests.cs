using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;

namespace CandidateService.IntegrationTests;

/// <summary>
/// candidate-service a través de HTTP real: creación, validación (400),
/// transición de stage (move → GET) y contrato de paginación.
/// </summary>
public class CandidatesApiTests : IDisposable
{
    private static readonly JsonSerializerOptions Json = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private readonly CandidateServiceApiFactory _factory = new();
    private readonly HttpClient _client;

    public CandidatesApiTests()
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

    private async Task<Guid> CreateCandidate(string email)
    {
        var response = await _client.PostAsJsonAsync("/api/candidates", new
        {
            firstName = "María",
            lastName = "López",
            email,
        }, Json);

        response.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return doc.RootElement.GetProperty("data").GetProperty("id").GetGuid();
    }

    [Fact]
    public async Task Create_ValidCandidate_ReturnsEnvelopeWithId()
    {
        var id = await CreateCandidate("maria@example.com");
        Assert.NotEqual(Guid.Empty, id);
    }

    [Fact]
    public async Task Create_InvalidEmail_Returns400()
    {
        var response = await _client.PostAsJsonAsync("/api/candidates", new
        {
            firstName = "María",
            lastName = "López",
            email = "sin-arroba",
        }, Json);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_MoveStage_GetById_ShowsScreening()
    {
        var id = await CreateCandidate("mover@example.com");

        var move = await _client.PostAsJsonAsync($"/api/candidates/{id}/move", new
        {
            stage = "Screening",
        }, Json);
        Assert.Equal(HttpStatusCode.OK, move.StatusCode);

        var get = await _client.GetAsync($"/api/candidates/{id}");
        get.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(await get.Content.ReadAsStringAsync());

        Assert.Equal("Screening",
            doc.RootElement.GetProperty("data").GetProperty("stage").GetString());
    }

    [Fact]
    public async Task GetCandidates_ReturnsPagedEnvelope()
    {
        await CreateCandidate("p1@example.com");
        await CreateCandidate("p2@example.com");

        var response = await _client.GetAsync("/api/candidates?page=1&pageSize=10");
        response.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

        var data = doc.RootElement.GetProperty("data");
        Assert.Equal(2, data.GetProperty("totalCount").GetInt32());
        Assert.Equal(2, data.GetProperty("items").GetArrayLength());
    }
}
