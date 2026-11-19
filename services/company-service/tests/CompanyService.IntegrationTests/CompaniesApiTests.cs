using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;

namespace CompanyService.IntegrationTests;

/// <summary>
/// company-service a través de HTTP real: creación (201 Created), validación
/// (400) y la regla async de TaxId duplicado ejecutada por el pipeline real
/// de FluentValidation (MustAsync contra el repositorio EF InMemory).
/// </summary>
public class CompaniesApiTests : IDisposable
{
    private static readonly JsonSerializerOptions Json = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private readonly CompanyServiceApiFactory _factory = new();
    private readonly HttpClient _client;

    public CompaniesApiTests()
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

    private async Task<HttpResponseMessage> CreateCompany(string name, string? taxId) =>
        await _client.PostAsJsonAsync("/api/companies", new
        {
            name,
            industry = "Technology",
            taxId,
        }, Json);

    [Fact]
    public async Task Create_ValidCompany_ReturnsCreatedWithId()
    {
        var response = await CreateCompany("Acme Corp", null);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.True(doc.RootElement.GetProperty("data").GetProperty("id").TryGetGuid(out _));
    }

    [Fact]
    public async Task Create_EmptyName_Returns400()
    {
        var response = await CreateCompany("", null);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_DuplicateTaxId_Returns400()
    {
        // La regla async (MustAsync -> ExistsByTaxIdAsync) corre dentro del
        // ValidationBehavior real contra la base InMemory.
        var first = await CreateCompany("Empresa Uno", "TAX-777");
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        var duplicate = await CreateCompany("Empresa Dos", "TAX-777");
        Assert.Equal(HttpStatusCode.BadRequest, duplicate.StatusCode);
    }
}
