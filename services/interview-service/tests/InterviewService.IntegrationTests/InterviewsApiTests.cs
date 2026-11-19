using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;

namespace InterviewService.IntegrationTests;

/// <summary>
/// interview-service a través de HTTP real: scheduling, y sobre todo las
/// reglas de negocio que viven en el handler — duplicado candidato+vacante
/// y solapamiento de agenda del recruiter — ejercidas como HTTP 409 reales
/// (InvalidOperationException -> GlobalExceptionHandler).
/// </summary>
public class InterviewsApiTests : IDisposable
{
    private static readonly JsonSerializerOptions Json = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private readonly InterviewServiceApiFactory _factory = new();
    private readonly HttpClient _client;

    private static readonly Guid RecruiterId = Guid.NewGuid();

    public InterviewsApiTests()
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

    private async Task<HttpResponseMessage> Schedule(
        Guid candidateId, Guid jobId, DateTime scheduledAt, int durationMinutes) =>
        await _client.PostAsJsonAsync("/api/interviews", new
        {
            candidateId,
            jobId,
            recruiterId = RecruiterId,
            title = "Entrevista de integración",
            interviewType = "Video",
            interviewStage = "Screening",
            scheduledAt,
            durationMinutes,
        }, Json);

    [Fact]
    public async Task Schedule_ValidInterview_ReturnsEnvelopeWithId()
    {
        var response = await Schedule(Guid.NewGuid(), Guid.NewGuid(), DateTime.UtcNow.AddDays(1), 60);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.True(doc.RootElement.GetProperty("data").GetProperty("id").TryGetGuid(out _));
    }

    [Fact]
    public async Task Schedule_DuplicateCandidateAndJob_Returns409()
    {
        var candidateId = Guid.NewGuid();
        var jobId = Guid.NewGuid();

        var first = await Schedule(candidateId, jobId, DateTime.UtcNow.AddDays(1), 60);
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        // Mismo candidato + misma vacante: la regla de negocio del handler
        // lanza InvalidOperationException -> HTTP 409 via GlobalExceptionHandler.
        var duplicate = await Schedule(candidateId, jobId, DateTime.UtcNow.AddDays(2), 60);
        Assert.Equal(HttpStatusCode.Conflict, duplicate.StatusCode);
    }

    [Fact]
    public async Task Schedule_OverlappingRecruiterAgenda_Returns409()
    {
        var baseTime = DateTime.UtcNow.AddDays(3);

        var first = await Schedule(Guid.NewGuid(), Guid.NewGuid(), baseTime, 60);
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        // Mismo recruiter, 30 minutos después -> solapa con la primera.
        var overlap = await Schedule(Guid.NewGuid(), Guid.NewGuid(), baseTime.AddMinutes(30), 60);
        Assert.Equal(HttpStatusCode.Conflict, overlap.StatusCode);
    }

    [Fact]
    public async Task Schedule_ZeroDuration_Returns400()
    {
        var response = await Schedule(Guid.NewGuid(), Guid.NewGuid(), DateTime.UtcNow.AddDays(1), 0);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
