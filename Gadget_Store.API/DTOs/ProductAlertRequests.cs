namespace GadgetStore.API.DTOs;

public class UpdateStockRequest
{
    public int NewStock { get; set; }
}

public class UpdatePriceRequest
{
    public decimal NewPrice { get; set; }
}