namespace JobService.Shared.Common;

public class Result
{
    public bool Success { get; init; }

    public string Message { get; init; } = string.Empty;

    public static Result Ok(string message = "")
    {
        return new Result
        {
            Success = true,
            Message = message
        };
    }

    public static Result Failure(string message)
    {
        return new Result
        {
            Success = false,
            Message = message
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
            Data = data
        };
    }

    public new static Result<T> Failure(string message)
    {
        return new Result<T>
        {
            Success = false,
            Message = message
        };
    }
}