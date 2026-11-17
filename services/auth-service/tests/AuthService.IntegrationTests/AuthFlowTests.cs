using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace AuthService.IntegrationTests;

/// <summary>
/// Flujo de autenticación completo contra la API real: registro, login,
/// regla "primer usuario = Admin", y cambio de contraseña. Verifica lo que
/// los tests unitarios no pueden: serialización JSON real, envelopes HTTP,
/// emisión/validación de JWT y mapeo de errores del GlobalExceptionHandler.
/// </summary>
public class AuthFlowTests
{
    private static readonly JsonSerializerOptions Json = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private static HttpClient CreateClient(AuthApiFactory factory) =>
        factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            // TestServer no abre sockets; sin redirecciones HTTPS internas.
            HandleCookies = false,
        });

    private static async Task<HttpResponseMessage> Register(
        HttpClient client, string email, string password = "Password123!")
    {
        return await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password,
            firstName = "Demo",
            lastName = "Usuario",
        }, Json);
    }

    private static async Task<JsonDocument> Login(
        HttpClient client, string email, string password = "Password123!")
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            email,
            password,
        }, Json);

        response.EnsureSuccessStatusCode();
        return JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Register_ValidUser_ReturnsEnvelopeWithUserId()
    {
        using var factory = new AuthApiFactory();
        using var client = CreateClient(factory);

        var response = await Register(client, "nuevo@example.com");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.True(doc.RootElement.GetProperty("success").GetBoolean());
        Assert.True(doc.RootElement.GetProperty("data").TryGetGuid(out _));
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns409()
    {
        using var factory = new AuthApiFactory();
        using var client = CreateClient(factory);

        await Register(client, "duplicado@example.com");
        var second = await Register(client, "duplicado@example.com");

        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
    }

    [Fact]
    public async Task Login_InvalidPassword_Returns401()
    {
        using var factory = new AuthApiFactory();
        using var client = CreateClient(factory);

        await Register(client, "juan@example.com");

        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "juan@example.com",
            password = "PasswordIncorrecta1!",
        }, Json);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsTokenWithUserAndRole()
    {
        using var factory = new AuthApiFactory();
        using var client = CreateClient(factory);

        await Register(client, "maria@example.com");

        using var doc = await Login(client, "maria@example.com");

        Assert.False(string.IsNullOrWhiteSpace(
            doc.RootElement.GetProperty("accessToken").GetString()));
        Assert.True(doc.RootElement.TryGetProperty("expiresAt", out _));

        var user = doc.RootElement.GetProperty("user");
        Assert.Equal("Demo Usuario", user.GetProperty("fullName").GetString());
        Assert.Equal("maria@example.com", user.GetProperty("email").GetString());
        Assert.False(string.IsNullOrWhiteSpace(user.GetProperty("role").GetString()));
    }

    [Fact]
    public async Task FirstUser_BecomesAdmin_AndSubsequentUsers_BecomeCandidates()
    {
        using var factory = new AuthApiFactory();
        using var client = CreateClient(factory);

        await Register(client, "primero@example.com");
        await Register(client, "segundo@example.com");

        using var first = await Login(client, "primero@example.com");
        using var second = await Login(client, "segundo@example.com");

        Assert.Equal("Admin",
            first.RootElement.GetProperty("user").GetProperty("role").GetString());
        Assert.Equal("Candidate",
            second.RootElement.GetProperty("user").GetProperty("role").GetString());
    }

    [Fact]
    public async Task ChangePassword_WrongCurrent_Returns400()
    {
        using var factory = new AuthApiFactory();
        using var client = CreateClient(factory);

        await Register(client, "cambia@example.com");
        using var login = await Login(client, "cambia@example.com");
        var token = login.RootElement.GetProperty("accessToken").GetString()!;

        using var authorized = CreateClient(factory);
        authorized.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var response = await authorized.PostAsJsonAsync("/api/auth/change-password", new
        {
            currentPassword = "NoEsLaActual1!",
            newPassword = "PasswordNueva1!",
        }, Json);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ChangePassword_Valid_ThenLoginWithNewPasswordWorks()
    {
        using var factory = new AuthApiFactory();
        using var client = CreateClient(factory);

        await Register(client, "rotacion@example.com");
        using var login = await Login(client, "rotacion@example.com");
        var token = login.RootElement.GetProperty("accessToken").GetString()!;

        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var change = await client.PostAsJsonAsync("/api/auth/change-password", new
        {
            currentPassword = "Password123!",
            newPassword = "PasswordNueva1!",
        }, Json);

        Assert.Equal(HttpStatusCode.OK, change.StatusCode);

        client.DefaultRequestHeaders.Authorization = null;
        using var relogin = await Login(client, "rotacion@example.com", "PasswordNueva1!");
        Assert.False(string.IsNullOrWhiteSpace(
            relogin.RootElement.GetProperty("accessToken").GetString()));
    }
}
