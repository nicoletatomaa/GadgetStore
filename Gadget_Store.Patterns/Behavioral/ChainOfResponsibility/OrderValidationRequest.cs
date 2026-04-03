using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.ChainOfResponsibility;

public class OrderValidationRequest
{
    public List<(string Name, decimal Price, int Qty)> Items { get; set; } = new();
    public string Region { get; set; } = "EU";
    public decimal DiscountAmount { get; set; } = 0m;
}

public class OrderValidationResult
{
    public bool IsValid { get; set; } = true;
    public List<string> Errors { get; set; } = new();
    public List<string> PassedHandlers { get; set; } = new();
}