using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.Command;

public interface ICartCommand
{
    void Execute();
    void Undo();
    string Description { get; }
}