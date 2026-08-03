using System.Reflection;

namespace CompanyService.Api.Endpoints;

public static class EndpointExtensions
{
    public static IEndpointRouteBuilder MapEndpoints(
        this IEndpointRouteBuilder app)
    {
        var endpointType = typeof(IEndpoint);

        var endpoints = Assembly
            .GetExecutingAssembly()
            .DefinedTypes
            .Where(type =>
                !type.IsAbstract &&
                !type.IsInterface &&
                endpointType.IsAssignableFrom(type));

        foreach (var endpoint in endpoints)
        {
            var instance = (IEndpoint)Activator.CreateInstance(endpoint.AsType())!;

            instance.MapEndpoint(app);
        }

        return app;
    }
}
