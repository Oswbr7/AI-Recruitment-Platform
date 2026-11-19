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
/// Applications a través de HTTP real: el ciclo completo del dominio ATS
/// (submit → review → interviewing → offer), la regla de duplicado activo
/// (409) y el filtrado por vacante — ejerciendo pipeline, behaviors y
/// GlobalExceptionHandler de punta a punta.
/// </summary>
public class ApplicationApiTests : IDisposable
{
    private static readonly JsonSerializerOptions Json = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private readonly CandidateServiceApiFactory _factory = new();
    private readonly HttpClient _client;

    public ApplicationApiTests()
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

    private async Task<HttpResponseMessage> Submit(Guid candidateId, Guid jobId) =>
        await _client.PostAsJsonAsync("/api/applications", new
        {
            candidateId,
            jobId,
            source = "Portal",
        }, Json);

    [Fact]
    public async Task Submit_ValidApplication_ReturnsCreatedWithId()
    {
        var candidateId = await CreateCandidate("app-valida@example.com");

        var response = await Submit(candidateId, Guid.NewGuid());

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal("Applied",
            doc.RootElement.GetProperty("data").GetProperty("status").GetString());
    }

    [Fact]
    public async Task Submit_CandidateNotFound_Returns404()
    {
        var response = await Submit(Guid.NewGuid(), Guid.NewGuid());

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Submit_DuplicateActiveApplication_Returns409()
    {
        var candidateId = await CreateCandidate("app-dup@example.com");
        var jobId = Guid.NewGuid();

        var first = await Submit(candidateId, jobId);
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        var duplicate = await Submit(candidateId, jobId);
        Assert.Equal(HttpStatusCode.Conflict, duplicate.StatusCode);
    }

    [Fact]
    public async Task FullPipeline_AppliedToOffered_ViaHttp()
    {
        var candidateId = await CreateCandidate("app-pipeline@example.com");

        var submit = await Submit(candidateId, Guid.NewGuid());
        submit.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(await submit.Content.ReadAsStringAsync());
        var id = doc.RootElement.GetProperty("data").GetProperty("id").GetGuid();

        await AssertTransition(id, "start-review", "Reviewing");
        await AssertTransition(id, "to-interviewing", "Interviewing");
        await AssertTransition(id, "offer", "Offered");
    }

    [Fact]
    public async Task Offer_DirectlyFromApplied_Returns409()
    {
        var candidateId = await CreateCandidate("app-salto@example.com");

        var submit = await Submit(candidateId, Guid.NewGuid());
        using var doc = JsonDocument.Parse(await submit.Content.ReadAsStringAsync());
        var id = doc.RootElement.GetProperty("data").GetProperty("id").GetGuid();

        // Applied -> Offered salta estados: la invariante de dominio lanza
        // InvalidOperationException -> HTTP 409 via GlobalExceptionHandler.
        var offer = await _client.PostAsync($"/api/applications/{id}/offer", null);
        Assert.Equal(HttpStatusCode.Conflict, offer.StatusCode);
    }

    [Fact]
    public async Task GetApplications_FilterByJob_ReturnsOnlyThatJob()
    {
        var candidateId = await CreateCandidate("app-filtro@example.com");
        var jobA = Guid.NewGuid();
        var jobB = Guid.NewGuid();

        await Submit(candidateId, jobA);
        await Submit(candidateId, jobB);

        var response = await _client.GetAsync($"/api/applications?jobId={jobA}&pageSize=50");
        response.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

        var data = doc.RootElement.GetProperty("data");
        Assert.Equal(1, data.GetProperty("totalCount").GetInt32());
        Assert.Equal(jobA,
            data.GetProperty("items")[0].GetProperty("jobId").GetGuid());
    }

    private async Task AssertTransition(Guid id, string verb, string expectedStatus)
    {
        var response = await _client.PostAsync($"/api/applications/{id}/{verb}", null);
        response.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal(expectedStatus, doc.RootElement.GetProperty("data").GetProperty("status").GetString());
    }
}
