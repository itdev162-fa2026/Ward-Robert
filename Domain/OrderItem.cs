using System.ComponentModel.DataAnnotations;

namespace Domain;

/*
    Foreign Key (OrderId): Links this OrderItem to its parent Order. EF Core will automatically recognize this as a foreign key.

ProductId: References the product, but we don't enforce a foreign key constraint because products might be deleted later, but we still want to keep historical order records.

ProductName & PriceAtPurchase: These capture the product name and price at the time of purchase. Even if the product changes or is deleted later, the order record remains accurate.

Navigation Property (Order): The Order property allows EF Core to navigate from an OrderItem back to its parent Order. The null! tells the compiler "trust me, this won't be null at runtime."

*/
public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public int ProductId { get; set; }

        [Required]
        [StringLength(100)]
        public string ProductName { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal PriceAtPurchase { get; set; }

        //Navigation property  back to Order
        public Order  Order { get; set; } = null!;
    }