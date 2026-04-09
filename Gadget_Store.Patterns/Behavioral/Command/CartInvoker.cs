using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.Command;

/// Invoker: execută comenzile și ține istoricul pentru undo.
public class CartInvoker
{
    private readonly Stack<ICartCommand> _history = new();

    public void ExecuteCommand(ICartCommand command)
    {
        command.Execute();
        _history.Push(command);
    }

    public string? Undo()
    {
        if (_history.Count == 0) return null;
        var command = _history.Pop();
        command.Undo();
        return command.Description;
    }

    public IEnumerable<string> GetHistory() =>
        _history.Select(c => c.Description);
}