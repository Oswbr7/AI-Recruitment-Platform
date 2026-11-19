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
/// Flujo "mis aplicaciones" completo y cierre de la brecha de privacidad:
/// perfil propio (me), Apply vinculado a mi perfil, /mine solo devuelve lo
/// mío, y el GET con filtros libres queda restringido a Admin/Recruiter.
/// </summary>
public class MyApplicationsApiTests : IDisposable
{
    private static readonly JsonSerializerOptions Json = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private readonly CandidateServiceApiFactory _factory = new();

    public void Dispose()
    {
        _factory.Dispose();
    }

    private HttpClient ClientWithRole(string role)
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", CreateToken(role));
        return client;
    }

    private static string CreateToken(string role)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("IntegrationTestSecretKey_Min32Chars!"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            "RecruitmentPlatform",
            "RecruitmentPlatform",
            new[] { new Claim("sub", Guid.NewGuid().ToString()), new Claim("role", role) },
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [Fact]
    public async Task GetMyProfile_WithoutProfile_Returns404()
    {
        using var client = ClientWithRole("Candidate");

        var response = await client.GetAsync("/api/candidates/me");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateMyProfile_Then_Get_ReturnsProfile()
    {
        using var client = ClientWithRole("Candidate");

        var create = await client.PostAsJsonAsync("/api/candidates/me", new
        {
            firstName = "Candidata",
            lastName = "Demo",
            email = "candidata@example.com",
            headline = "Backend developer",
        }, Json);

        Assert.Equal(HttpStatusCode.Created, create.StatusCode);

        var get = await client.GetAsync("/api/candidates/me");
        get.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(await get.Content.ReadAsStringAsync());

        Assert.Equal("Candidata",
            doc.RootElement.GetProperty("data").GetProperty("firstName").GetString());
        Assert.Equal("Demo",
            doc.RootElement.GetProperty("data").GetProperty("lastName").GetString());
    }

    [Fact]
    public async Task CreateMyProfile_Twice_Returns409()
    {
        using var client = ClientWithRole("Candidate");

        var first = await client.PostAsJsonAsync("/api/candidates/me", new
        {
            firstName = "Uno",
            lastName = "Demo",
            email = "uno@example.com",
        }, Json);
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        var second = await client.PostAsJsonAsync("/api/candidates/me", new
        {
            firstName = "Otra",
            lastName = "Vez",
            email = "otra@example.com",
        }, Json);

        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
    }

    [Fact]
    public async Task MyApplications_Flow_ProfileApplyWithdraw()
    {
        using var candidate = ClientWithRole("Candidate");

        // 1. Sin perfil: /mine devuelve página vacía (no 404, UX amable).
        var empty = await candidate.GetAsync("/api/applications/mine");
        empty.EnsureSuccessStatusCode();
        using var emptyDoc = JsonDocument.Parse(await empty.Content.ReadAsStringAsync());
        Assert.Equal(0, emptyDoc.RootElement.GetProperty("data").GetProperty("totalCount").GetInt32());

        // 2. Creo mi perfil.
        await candidate.PostAsJsonAsync("/api/candidates/me", new
        {
            firstName = "Flujo",
            lastName = "Completo",
            email = "flujo@example.com",
        }, Json);

        using var profile = JsonDocument.Parse(
            await (await candidate.GetAsync("/api/candidates/me")).Content.ReadAsStringAsync());
        var myCandidateId = profile.RootElement.GetProperty("data").GetProperty("id").GetGuid();

        // 3. Aplico a una vacante con MI candidateId.
        var jobId = Guid.NewGuid();
        var apply = await candidate.PostAsJsonAsync("/api/applications", new
        {
            candidateId = myCandidateId,
            jobId,
            source = "Portal",
        }, Json);
        Assert.Equal(HttpStatusCode.Created, apply.StatusCode);

        // 4. /mine devuelve mi aplicación.
        var mine = await candidate.GetAsync("/api/applications/mine");
        using var mineDoc = JsonDocument.Parse(await mine.Content.ReadAsStringAsync());
        var items = mineDoc.RootElement.GetProperty("data").GetProperty("items");
        Assert.Equal(1, items.GetArrayLength());
        var applicationId = items[0].GetProperty("id").GetGuid();

        // 5. Me retiro: el candidato puede hacer Withdraw de lo suyo.
        var withdraw = await candidate.PostAsync($"/api/applications/{applicationId}/withdraw", null);
        Assert.Equal(HttpStatusCode.OK, withdraw.StatusCode);

        var after = await candidate.GetAsync("/api/applications/mine");
        using var afterDoc = JsonDocument.Parse(await after.Content.ReadAsStringAsync());
        Assert.Equal("Withdrawn",
            afterDoc.RootElement.GetProperty("data").GetProperty("items")[0].GetProperty("status").GetString());
    }

    [Fact]
    public async Task GetApplications_WithCandidateToken_Returns403()
    {
        using var candidate = ClientWithRole("Candidate");

        // Cierre de la brecha: los filtros libres son vista de gestión.
        var response = await candidate.GetAsync("/api/applications?pageSize=50");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetApplications_WithRecruiterToken_Returns200()
    {
        using var recruiter = ClientWithRole("Recruiter");

        var response = await recruiter.GetAsync("/api/applications?pageSize=50");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
