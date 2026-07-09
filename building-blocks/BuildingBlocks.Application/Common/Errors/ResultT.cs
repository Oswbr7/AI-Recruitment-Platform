using BuildingBlocks.Application.Common.Errors;

namespace BuildingBlocks.Application.Common.Errors;

public sealed class Result<T> : Result
{
    private readonly T? _value;

    private Result(
        T value)
        : base(true, Error.None)
    {
        _value = value;
    }

    private Result(
        Error error)
        : base(false, error)
    {
    }

    public T Value =>
        IsSuccess
            ? _value!
            : throw new InvalidOperationException();

    public static Result<T> Success(
        T value)
        => new(value);

    public static new Result<T> Failure(
        Error error)
        => new(error);
}