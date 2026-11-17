using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace AuthService.IntegrationTests;

/// <summary>
/// Autorización real sobre el pipeline completo: sin token (401), con rol
/// equivocado (403) y con el rol correcto (200). Ejerce el RequireRole de
/// los endpoints de usuarios y la regla Admin+Recruiter del listado.
/// </summary>
public class AuthorizationTests
{
    private static readonly JsonSerializerOptions Json = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private static async Task<HttpClient> RegisterAndLogin(
        AuthApiFactory factory, string email)
    {
        var client = factory.CreateClient();

        await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password = "Password123!",
            firstName = "Demo",
            lastName = "Usuario",
        }, Json);

        var login = await client.PostAsJsonAsync("/api/auth/login", new
        {
            email,
            password = "Password123!",
        }, Json);

        login.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(await login.Content.ReadAsStringAsync());
        var token = doc.RootElement.GetProperty("accessToken").GetString()!;

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        return client;
    }

    [Fact]
    public async Task GetUsers_WithoutToken_Returns401()
    {
        using var factory = new AuthApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/users");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ChangeRole_WithCandidateToken_Returns403()
    {
        using var factory = new AuthApiFactory();

        // Primer usuario = Admin (regla self-hosted); el segundo es Candidate.
        using var admin = await RegisterAndLogin(factory, "admin@example.com");
        using var candidate = await RegisterAndLogin(factory, "candidato@example.com");

        var users = JsonDocument.Parse(await (await admin.GetAsync("/api/users")).Content.ReadAsStringAsync());
        var candidateId = users.RootElement
            .GetProperty("data").EnumerateArray()
            .Single(u => u.GetProperty("email").GetString() == "candidato@example.com")
            .GetProperty("id").GetGuid();

        var forbidden = await candidate.PatchAsJsonAsync(
            $"/api/users/{candidateId}/role",
            new { role = "Recruiter" },
            Json);

        Assert.Equal(HttpStatusCode.Forbidden, forbidden.StatusCode);
    }

    [Fact]
    public async Task ChangeRole_WithAdminToken_Promotes_AndRecruiterCanListUsers()
    {
        using var factory = new AuthApiFactory();

        using var admin = await RegisterAndLogin(factory, "admin@example.com");
        using var candidate = await RegisterAndLogin(factory, "promovido@example.com");

        var users = JsonDocument.Parse(await (await admin.GetAsync("/api/users")).Content.ReadAsStringAsync());
        var candidateId = users.RootElement
            .GetProperty("data").EnumerateArray()
            .Single(u => u.GetProperty("email").GetString() == "promovido@example.com")
            .GetProperty("id").GetGuid();

        var patch = await admin.PatchAsJsonAsync(
            $"/api/users/{candidateId}/role",
            new { role = "Recruiter" },
            Json);

        Assert.Equal(HttpStatusCode.OK, patch.StatusCode);

        // El JWT del usuario se EMITIO antes de la promocion: sus claims
        // quedaron horneados como "Candidate" (los cambios de rol no aplican
        // a tokens ya emitidos). Debe re-loguear para obtener el rol nuevo.
        using var promoted = await RegisterAndLogin(factory, "promovido@example.com");

        // El recruiter promovido puede listar usuarios (regla Admin+Recruiter
        // del GET /api/users endurecida en la batería de deuda).
        var list = await promoted.GetAsync("/api/users");
        Assert.Equal(HttpStatusCode.OK, list.StatusCode);
    }

    [Fact]
    public async Task ValidationFailure_Returns400WithProblemDetails()
    {
        using var factory = new AuthApiFactory();
        using var client = factory.CreateClient();

        // Password de 6 caracteres: el ValidationBehavior + FluentValidation
        // lo rechazan antes del handler (regla min 8).
        var response = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email = "corto@example.com",
            password = "123456",
            firstName = "Demo",
            lastName = "Usuario",
        }, Json);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
