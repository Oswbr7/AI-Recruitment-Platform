using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

// =============================================================================
// SeedDemo — puebla la plataforma con datos de demostracion A TRAVES de las
// APIs reales (auth → companies → jobs → candidates → interviews → feedback).
//
// Idempotente: re-ejecutarlo solo crea lo que falta (busca por clave natural:
// email de candidato/usuario, nombre de empresa, titulo de vacante/entrevista).
//
// Uso (con el stack de docker-compose arriba):
//   dotnet run --project tools/SeedDemo
//
// Configuracion por variables de entorno (valores por defecto = compose local):
//   AUTH_API, COMPANIES_API, JOBS_API, CANDIDATES_API, INTERVIEWS_API,
//   ADMIN_EMAIL, ADMIN_PASSWORD, RECRUITER_EMAIL
//
// El seed tambien ejerce el flujo de roles: crea el admin (primer usuario =
// Admin por regla del backend), registra un segundo usuario y lo promueve a
// Recruiter con PATCH /api/users/{id}/role.
// =============================================================================

var config = new SeedConfig();
var json = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = false,
};

using var http = new HttpClient();

try
{
    // ------------------------------------------------------------------
    // 1. Usuarios: admin (primer registro = Admin) + recruiter promovido
    // ------------------------------------------------------------------
    var adminId = await EnsureUser(
        config.AdminEmail, config.AdminPassword, "Demo", "Admin");
    var adminToken = await Login(config.AdminEmail, config.AdminPassword);

    var recruiterId = await EnsureUser(
        config.RecruiterEmail, config.AdminPassword, "Rosa", "Reclutadora");
    await EnsureRecruiterRole(recruiterId, adminToken);
    var recruiterToken = await Login(config.RecruiterEmail, config.AdminPassword);

    // ------------------------------------------------------------------
    // 2. Empresas
    // ------------------------------------------------------------------
    var companies = new (string Name, string Industry, string City)[]
    {
        ("Nebula Labs", "Technology", "Guadalajara"),
        ("Kudo Health", "Healthcare", "Ciudad de Mexico"),
        ("Andamio Retail", "Retail", "Monterrey"),
    };

    var companyIds = new Dictionary<string, Guid>();
    foreach (var (name, industry, city) in companies)
    {
        companyIds[name] = await EnsureCompany(name, industry, city, recruiterToken);
    }

    // ------------------------------------------------------------------
    // 3. Vacantes (publicadas)
    // ------------------------------------------------------------------
    var jobs = new (string Title, string Dept, string Location, string EmpType,
                    string Level, string Remote, decimal Min, decimal Max, string Company)[]
    {
        ("Backend Developer (.NET)", "Engineering", "Guadalajara",
            "FullTime", "MidLevel", "Hybrid", 30000, 50000, "Nebula Labs"),
        ("Frontend Developer (React)", "Engineering", "Remoto",
            "FullTime", "Junior", "Remote", 20000, 32000, "Nebula Labs"),
        ("Data Engineer", "Data", "Ciudad de Mexico",
            "FullTime", "Senior", "OnSite", 45000, 65000, "Kudo Health"),
        ("Tech Lead", "Engineering", "Guadalajara",
            "FullTime", "Lead", "Hybrid", 60000, 85000, "Nebula Labs"),
    };

    var jobIds = new Dictionary<string, Guid>();
    foreach (var (title, dept, location, empType, level, remote, min, max, company) in jobs)
    {
        jobIds[title] = await EnsureJob(
            title, dept, location, empType, level, remote, min, max,
            companyIds[company], recruiterToken);
    }

    // ------------------------------------------------------------------
    // 4. Candidatos (perfiles variados para que el matching muestre ranking)
    // ------------------------------------------------------------------
    var candidates = new CandidateSeed[]
    {
        new("Maria", "Lopez", "maria.lopez@demo.local", "Guadalajara",
            "Backend developer", "Backend developer with .NET and API experience",
            "Software Engineer", 4, 40000),
        new("Carlos", "Ruiz", "carlos.ruiz@demo.local", "Remoto",
            "Frontend developer", "Frontend developer with React and TypeScript experience",
            "Frontend Developer", 2, 25000),
        new("Ana", "Martin", "ana.martin@demo.local", "Ciudad de Mexico",
            "Data Engineer", "Data engineer with pipelines and warehousing experience",
            "Data Engineer", 6, 55000),
        new("Jorge", "Perez", "jorge.perez@demo.local", "Guadalajara",
            "Junior backend developer", "Junior developer learning .NET",
            "Junior Developer", 1, 22000),
        new("Sofia", "Hernandez", "sofia.hernandez@demo.local", "Guadalajara",
            "Senior frontend developer", "Frontend developer with React experience and design systems",
            "Senior Frontend Developer", 5, 45000),
        new("Diego", "Torres", "diego.torres@demo.local", "Guadalajara",
            "Tech lead", "Engineering lead with architecture and mentoring experience",
            "Tech Lead", 9, 70000),
    };

    var candidateIds = new Dictionary<string, Guid>();
    foreach (var c in candidates)
    {
        candidateIds[c.Email] = await EnsureCandidate(c, recruiterToken);
    }

    // ------------------------------------------------------------------
    // 5. Entrevistas (+ feedback en la completada)
    // ------------------------------------------------------------------
    var maria = candidateIds["maria.lopez@demo.local"];
    var carlos = candidateIds["carlos.ruiz@demo.local"];
    var ana = candidateIds["ana.martin@demo.local"];
    var sofia = candidateIds["sofia.hernandez@demo.local"];

    await EnsureInterview(
        maria, jobIds["Backend Developer (.NET)"], recruiterId,
        "Entrevista tecnica - Maria", "Technical", "TechnicalInterview",
        DateTime.UtcNow.AddDays(2), 60, recruiterToken);

    await EnsureInterview(
        carlos, jobIds["Frontend Developer (React)"], recruiterId,
        "Screening call - Carlos", "Video", "Screening",
        DateTime.UtcNow.AddDays(3), 30, recruiterToken);

    var anaInterviewId = await EnsureInterview(
        ana, jobIds["Data Engineer"], recruiterId,
        "Entrevista senior - Ana", "OnSite", "Technical",
        DateTime.UtcNow.AddDays(-2), 60, recruiterToken);

    await EnsureInterviewCompleted(anaInterviewId, recruiterToken);
    await EnsureFeedback(anaInterviewId, recruiterId, recruiterToken);

    await EnsureInterview(
        sofia, jobIds["Frontend Developer (React)"], recruiterId,
        "Entrevista RRHH - Sofia", "Video", "HRInterview",
        DateTime.UtcNow.AddDays(5), 45, recruiterToken);

    Console.WriteLine();
    Console.WriteLine("[ok] Seed completo. Login: {0} / {1}", config.AdminEmail, config.AdminPassword);
    return 0;
}
catch (Exception ex)
{
    Console.WriteLine();
    Console.WriteLine("[error] {0}", ex.Message);
    Console.WriteLine("        Verifica que el stack este arriba (docker compose up -d).");
    return 1;
}

// =============================================================================
// Helpers
// =============================================================================

HttpRequestMessage Authorized(HttpMethod method, string url, string token)
{
    var request = new HttpRequestMessage(method, url);
    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
    return request;
}

async Task<HttpResponseMessage> Send(HttpRequestMessage request, string action)
{
    var response = await http.SendAsync(request);
    if (!response.IsSuccessStatusCode)
    {
        var body = await response.Content.ReadAsStringAsync();
        throw new InvalidOperationException(
            $"{action} fallo con {(int)response.StatusCode}: {body}");
    }
    return response;
}

async Task<Guid> ReadDataId(HttpResponseMessage response)
{
    using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    return doc.RootElement.GetProperty("data").GetProperty("id").GetGuid();
}

async Task<string> Login(string email, string password)
{
    var response = await http.PostAsJsonAsync(
        $"{config.AuthApi}/auth/login",
        new { email, password },
        json);

    if (!response.IsSuccessStatusCode)
    {
        var body = await response.Content.ReadAsStringAsync();
        throw new InvalidOperationException(
            $"login de {email} fallo con {(int)response.StatusCode}: {body}");
    }

    using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    return doc.RootElement.GetProperty("accessToken").GetString()
        ?? throw new InvalidOperationException("El login no devolvio accessToken.");
}

async Task<Guid> EnsureUser(string email, string password, string firstName, string lastName)
{
    var response = await http.PostAsJsonAsync(
        $"{config.AuthApi}/auth/register",
        new { email, password, firstName, lastName },
        json);

    if (response.StatusCode == HttpStatusCode.Conflict)
    {
        Console.WriteLine($"[skip] usuario {email} ya existe");
    }
    else if (!response.IsSuccessStatusCode)
    {
        var body = await response.Content.ReadAsStringAsync();
        throw new InvalidOperationException(
            $"registro de {email} fallo con {(int)response.StatusCode}: {body}");
    }
    else
    {
        Console.WriteLine($"[ok] usuario {email} creado");
    }

    // El id del usuario se obtiene del login (UserSummary).
    using var doc = JsonDocument.Parse(
        await (await http.PostAsJsonAsync(
            $"{config.AuthApi}/auth/login",
            new { email, password },
            json)).Content.ReadAsStringAsync());
    return doc.RootElement.GetProperty("user").GetProperty("id").GetGuid();
}

async Task EnsureRecruiterRole(Guid userId, string adminToken)
{
    var request = Authorized(HttpMethod.Get, $"{config.AuthApi}/users?role=Recruiter", adminToken);
    var response = await Send(request, "consulta de recruiters");
    using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

    foreach (var user in doc.RootElement.GetProperty("data").EnumerateArray())
    {
        if (user.GetProperty("id").GetGuid() == userId)
        {
            Console.WriteLine("[skip] el recruiter ya tiene su rol");
            return;
        }
    }

    var patch = Authorized(HttpMethod.Patch,
        $"{config.AuthApi}/users/{userId}/role", adminToken);
    patch.Content = JsonContent.Create(new { role = "Recruiter" }, options: json);
    await Send(patch, $"promocion a Recruiter de {userId}");
    Console.WriteLine("[ok] usuario promovido a Recruiter");
}

async Task<Guid> EnsureCompany(string name, string industry, string city, string token)
{
    var list = Authorized(HttpMethod.Get,
        $"{config.CompaniesApi}/companies?search={Uri.EscapeDataString(name)}&pageSize=50", token);
    var response = await Send(list, $"busqueda de empresa {name}");
    using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

    foreach (var item in doc.RootElement.GetProperty("data").GetProperty("items").EnumerateArray())
    {
        if (string.Equals(item.GetProperty("name").GetString(), name, StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine($"[skip] empresa {name} ya existe");
            return item.GetProperty("id").GetGuid();
        }
    }

    var create = Authorized(HttpMethod.Post, $"{config.CompaniesApi}/companies", token);
    create.Content = JsonContent.Create(new
    {
        name,
        industry,
        description = $"Empresa de demo: {name}",
        country = "Mexico",
        city,
    }, options: json);

    var created = await Send(create, $"creacion de empresa {name}");
    Console.WriteLine($"[ok] empresa {name} creada");
    return await ReadDataId(created);
}

async Task<Guid> EnsureJob(string title, string department, string location, string employmentType,
    string experienceLevel, string remoteType, decimal salaryMin, decimal salaryMax,
    Guid companyId, string token)
{
    var list = Authorized(HttpMethod.Get, $"{config.JobsApi}/jobs", token);
    var response = await Send(list, "listado de vacantes");
    using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

    foreach (var item in doc.RootElement.GetProperty("data").EnumerateArray())
    {
        if (string.Equals(item.GetProperty("title").GetString(), title, StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine($"[skip] vacante {title} ya existe");
            return item.GetProperty("id").GetGuid();
        }
    }

    var create = Authorized(HttpMethod.Post, $"{config.JobsApi}/jobs", token);
    create.Content = JsonContent.Create(new
    {
        title,
        description = $"Vacante de demo para {title}.",
        department,
        location,
        employmentType,
        experienceLevel,
        remoteType,
        salaryMin,
        salaryMax,
        currency = "MXN",
        companyId,
    }, options: json);

    var created = await Send(create, $"creacion de vacante {title}");
    var id = await ReadDataId(created);

    var publish = Authorized(HttpMethod.Post, $"{config.JobsApi}/jobs/{id}/publish", token);
    await Send(publish, $"publicacion de vacante {title}");
    Console.WriteLine($"[ok] vacante {title} creada y publicada");
    return id;
}

async Task<Guid> EnsureCandidate(CandidateSeed c, string token)
{
    var list = Authorized(HttpMethod.Get,
        $"{config.CandidatesApi}/candidates?search={Uri.EscapeDataString(c.Email)}&pageSize=10", token);
    var response = await Send(list, $"busqueda de candidato {c.Email}");
    using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

    foreach (var item in doc.RootElement.GetProperty("data").GetProperty("items").EnumerateArray())
    {
        if (string.Equals(item.GetProperty("email").GetString(), c.Email, StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine($"[skip] candidato {c.Email} ya existe");
            return item.GetProperty("id").GetGuid();
        }
    }

    var create = Authorized(HttpMethod.Post, $"{config.CandidatesApi}/candidates", token);
    create.Content = JsonContent.Create(new
    {
        c.FirstName,
        c.LastName,
        c.Email,
        location = c.Location,
        headline = c.Headline,
        summary = c.Summary,
        currentPosition = c.CurrentPosition,
        yearsOfExperience = c.YearsOfExperience,
        expectedSalary = c.ExpectedSalary,
        currency = "MXN",
    }, options: json);

    var created = await Send(create, $"creacion de candidato {c.Email}");
    Console.WriteLine($"[ok] candidato {c.Email} creado");
    return await ReadDataId(created);
}

async Task<Guid> EnsureInterview(Guid candidateId, Guid jobId, Guid recruiterId,
    string title, string interviewType, string interviewStage,
    DateTime scheduledAt, int durationMinutes, string token)
{
    var list = Authorized(HttpMethod.Get,
        $"{config.InterviewsApi}/interviews?candidateId={candidateId}&pageSize=50", token);
    var response = await Send(list, $"busqueda de entrevistas de {candidateId}");
    using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

    foreach (var item in doc.RootElement.GetProperty("data").GetProperty("items").EnumerateArray())
    {
        if (string.Equals(item.GetProperty("title").GetString(), title, StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine($"[skip] entrevista {title} ya existe");
            return item.GetProperty("id").GetGuid();
        }
    }

    var create = Authorized(HttpMethod.Post, $"{config.InterviewsApi}/interviews", token);
    create.Content = JsonContent.Create(new
    {
        candidateId,
        jobId,
        recruiterId,
        title,
        description = $"Entrevista de demo: {title}",
        interviewType,
        interviewStage,
        scheduledAt,
        durationMinutes,
    }, options: json);

    var created = await Send(create, $"creacion de entrevista {title}");
    Console.WriteLine($"[ok] entrevista {title} creada");
    return await ReadDataId(created);
}

async Task EnsureInterviewCompleted(Guid interviewId, string token)
{
    var get = Authorized(HttpMethod.Get,
        $"{config.InterviewsApi}/interviews/{interviewId}", token);
    var response = await Send(get, "consulta de entrevista");
    using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

    if (doc.RootElement.GetProperty("data").GetProperty("status").GetString() == "Completed")
    {
        Console.WriteLine("[skip] la entrevista de Ana ya estaba completada");
        return;
    }

    var complete = Authorized(HttpMethod.Post,
        $"{config.InterviewsApi}/interviews/{interviewId}/complete", token);
    await Send(complete, "completar entrevista de Ana");
    Console.WriteLine("[ok] entrevista de Ana completada");
}

async Task EnsureFeedback(Guid interviewId, Guid recruiterId, string token)
{
    var get = Authorized(HttpMethod.Get,
        $"{config.InterviewsApi}/interviews/{interviewId}/feedback", token);
    var response = await Send(get, "consulta de feedback");
    using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

    if (doc.RootElement.GetProperty("data").GetProperty("items").GetArrayLength() > 0)
    {
        Console.WriteLine("[skip] la entrevista de Ana ya tiene feedback");
        return;
    }

    var submit = Authorized(HttpMethod.Post,
        $"{config.InterviewsApi}/interviews/{interviewId}/feedback", token);
    submit.Content = JsonContent.Create(new
    {
        reviewerId = recruiterId,
        technicalScore = 5,
        communicationScore = 4,
        problemSolvingScore = 5,
        cultureFitScore = 4,
        comments = "Excelente candidata de demo: solida en pipelines y muy buena comunicacion.",
        recommendation = "StrongHire",
    }, options: json);

    await Send(submit, "envio de feedback de Ana");
    Console.WriteLine("[ok] feedback de Ana enviado");
}

// =============================================================================
// Config y modelos
// =============================================================================

sealed record CandidateSeed(
    string FirstName,
    string LastName,
    string Email,
    string Location,
    string Headline,
    string Summary,
    string CurrentPosition,
    int YearsOfExperience,
    decimal ExpectedSalary);

sealed class SeedConfig
{
    public string AuthApi { get; } =
        Environment.GetEnvironmentVariable("AUTH_API") ?? "http://localhost:5000/api";

    public string CompaniesApi { get; } =
        Environment.GetEnvironmentVariable("COMPANIES_API") ?? "http://localhost:5003/api";

    public string JobsApi { get; } =
        Environment.GetEnvironmentVariable("JOBS_API") ?? "http://localhost:5001/api";

    public string CandidatesApi { get; } =
        Environment.GetEnvironmentVariable("CANDIDATES_API") ?? "http://localhost:5002/api";

    public string InterviewsApi { get; } =
        Environment.GetEnvironmentVariable("INTERVIEWS_API") ?? "http://localhost:5004/api";

    public string AdminEmail { get; } =
        Environment.GetEnvironmentVariable("ADMIN_EMAIL") ?? "admin@demo.local";

    public string AdminPassword { get; } =
        Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? "Demo123!";

    public string RecruiterEmail { get; } =
        Environment.GetEnvironmentVariable("RECRUITER_EMAIL") ?? "recruiter@demo.local";
}
