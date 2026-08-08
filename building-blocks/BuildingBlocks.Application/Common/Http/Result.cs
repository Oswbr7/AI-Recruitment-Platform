namespace BuildingBlocks.Application.Common.Http;

/// <summary>
/// HTTP response envelope ({Success, Message, Data}). Distinct from
/// BuildingBlocks.Application.Common.Errors.Result (a domain outcome monad) — that type
/// answers "did the operation succeed", this one shapes the JSON body returned to callers.
/// </summary>
public class Result
{
    public bool Success { get; init; }

    public string Message { get; init; } = string.Empty;

    public static Result Ok(string message = "")
    {
        return new Result
        {
            Success = true,
            Message = message,
        };
    }

    public static Result Failure(string message)
    {
        return new Result
        {
            Success = false,
            Message = message,
        };
    }
}

public class Result<T> : Result
{
    public T? Data { get; init; }

    public static Result<T> Ok(T data, string message = "")
    {
        return new Result<T>
        {
            Success = true,
            Message = message,
            Data = data,
        };
    }

    public new static Result<T> Failure(string message)
    {
        return new Result<T>
        {
            Success = false,
            Message = message,
        };
    }
}
