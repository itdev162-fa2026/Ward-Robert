using System.ComponentModel.DataAnnotations;

namespace Domain;
/*
    Enum (OrderStatus): Defines the possible states an order can be in (Pending, Completed, Failed). Enums are better than strings because they prevent typos and are type-safe.

Navigation Property (OrderItems): This List<OrderItem> establishes the "one-to-many" relationship—one Order can have many OrderItems.

Nullable DateTime (CompletedDate?): The ? makes this nullable, meaning it can be null until the order is completed.

*/
public enum OrderStatus
{
    Pending,
    Completed,
    Failed
}

public class Order
{
    public int Id { get; set; }

    [Required]
    [EmailAddress]
    public string CustomerEmail { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal TotalAmount { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public DateTime CreatedDate { get; set; }

    public DateTime ? CompletedDate { get; set; }

    // Navigation property- an order can have multiple order items
    public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
