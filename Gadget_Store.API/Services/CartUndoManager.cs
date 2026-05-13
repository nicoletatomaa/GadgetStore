namespace GadgetStore.API.Services;

/// <summary>
/// Singleton — retine stiva de operatii undo per utilizator.
/// Pattern: Command — fiecare modificare a cosului stocheaza o actiune inversa.
/// </summary>
public class CartUndoManager
{
    private readonly Dictionary<Guid, Stack<Func<Task<string>>>> _stacks = new();

    public void Push(Guid userId, Func<Task<string>> undoAction)
    {
        if (!_stacks.ContainsKey(userId))
            _stacks[userId] = new Stack<Func<Task<string>>>();
        _stacks[userId].Push(undoAction);
    }

    public async Task<string?> Undo(Guid userId)
    {
        if (!_stacks.TryGetValue(userId, out var stack) || stack.Count == 0)
            return null;
        var action = stack.Pop();
        return await action();
    }

    public bool CanUndo(Guid userId) =>
        _stacks.TryGetValue(userId, out var stack) && stack.Count > 0;

    public void Clear(Guid userId) => _stacks.Remove(userId);
}
