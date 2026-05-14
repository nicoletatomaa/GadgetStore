using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(GadgetStoreDbContext context)
    {
        await context.Database.MigrateAsync();

        if (await context.Categories.AnyAsync()) return;

        // ── Categories ────────────────────────────────────────────────────────
        var electronics = new Category("Electronice", null, "Gadget-uri si dispozitive electronice", null, 1);
        var accessories = new Category("Accesorii", null, "Accesorii pentru dispozitive electronice", null, 2);
        var wearables   = new Category("Wearables", null, "Dispozitive purtabile: smartwatch-uri, fitness trackers", null, 3);

        await context.Categories.AddRangeAsync(electronics, accessories, wearables);
        await context.SaveChangesAsync();

        var phones  = new Category("Telefoane",  electronics.Id, "Smartphone-uri si telefoane mobile", null, 1);
        var laptops = new Category("Laptopuri",  electronics.Id, "Laptopuri si ultrabook-uri", null, 2);
        var tablets = new Category("Tablete",    electronics.Id, "iPad-uri si tablete Android", null, 3);
        var audio   = new Category("Audio",      accessories.Id, "Casti, boxe si accesorii audio", null, 1);
        var cases   = new Category("Huse",       accessories.Id, "Huse si protectii telefon", null, 2);
        var chargers= new Category("Incarcatoare", accessories.Id, "Incarcatoare si cabluri", null, 3);

        await context.Categories.AddRangeAsync(phones, laptops, tablets, audio, cases, chargers);
        await context.SaveChangesAsync();

        // ── Products ──────────────────────────────────────────────────────────
        var iphone16Pro = new ElectronicsProduct("iPhone 16 Pro 256GB", 6299m, 25, "Apple")
        {
            CategoryId   = phones.Id,
            Description  = "Cel mai avansat iPhone cu chip A18 Pro, camera 48MP si ecran ProMotion 6.3\"",
            ImageUrl     = "https://picsum.photos/seed/iphone16pro/400/400",
            IsTemplate   = true,
            TemplateName = "iphone-template",
            IsActive     = true
        };
        iphone16Pro.Tags.AddRange(new[] { "smartphone", "apple", "5G", "flagship" });

        var iphone15 = new ElectronicsProduct("iPhone 15 128GB", 4699m, 40, "Apple")
        {
            CategoryId  = phones.Id,
            Description = "iPhone 15 cu chip A16 Bionic, Dynamic Island si camera 48MP",
            ImageUrl    = "https://picsum.photos/seed/iphone15/400/400",
            IsActive    = true
        };
        iphone15.Tags.AddRange(new[] { "smartphone", "apple", "5G" });

        var galaxyS24 = new ElectronicsProduct("Samsung Galaxy S24 Ultra", 5499m, 30, "Samsung")
        {
            CategoryId  = phones.Id,
            Description = "Samsung Galaxy S24 Ultra cu S Pen, camera 200MP si ecran 6.8\"",
            ImageUrl    = "https://picsum.photos/seed/galaxys24/400/400",
            IsActive    = true
        };
        galaxyS24.Tags.AddRange(new[] { "smartphone", "samsung", "android", "5G" });

        var macbookPro = new ElectronicsProduct("MacBook Pro 14\" M4 Pro", 12999m, 10, "Apple")
        {
            CategoryId   = laptops.Id,
            Description  = "MacBook Pro cu chip M4 Pro, 24GB RAM, 512GB SSD, ecran Liquid Retina XDR",
            ImageUrl     = "https://picsum.photos/seed/macbookpro/400/400",
            IsTemplate   = true,
            TemplateName = "macbook-template",
            IsActive     = true
        };
        macbookPro.Tags.AddRange(new[] { "laptop", "apple", "M4", "professional" });

        var dellXps = new ElectronicsProduct("Dell XPS 15 9530", 7499m, 15, "Dell")
        {
            CategoryId  = laptops.Id,
            Description = "Dell XPS 15 cu Intel Core i7-13700H, RTX 4060, 32GB RAM, display OLED 3.5K",
            ImageUrl    = "https://picsum.photos/seed/dellxps/400/400",
            IsActive    = true
        };
        dellXps.Tags.AddRange(new[] { "laptop", "dell", "windows", "gaming" });

        var airpodsPro = new AccessoryProduct("AirPods Pro (2nd Gen)", 1299m, 50, "iPhone/iPad/Mac")
        {
            CategoryId   = audio.Id,
            Description  = "AirPods Pro cu Active Noise Cancellation, Transparency mode si Adaptive Audio",
            ImageUrl     = "https://picsum.photos/seed/airpodspro/400/400",
            IsTemplate   = true,
            TemplateName = "airpods-template",
            IsActive     = true
        };
        airpodsPro.Tags.AddRange(new[] { "audio", "wireless", "apple", "ANC" });

        var sonyWH1000 = new AccessoryProduct("Sony WH-1000XM5", 1799m, 20, "Universal")
        {
            CategoryId  = audio.Id,
            Description = "Casti over-ear Sony cu cele mai bune ANC din industrie si 30h autonomie",
            ImageUrl    = "https://picsum.photos/seed/sonywh1000/400/400",
            IsActive    = true
        };
        sonyWH1000.Tags.AddRange(new[] { "audio", "wireless", "sony", "ANC", "premium" });

        var usbcHub = new AccessoryProduct("Anker USB-C Hub 7-in-1", 249m, 100, "USB-C laptops")
        {
            CategoryId  = chargers.Id,
            Description = "Hub USB-C cu HDMI 4K, 3x USB-A, USB-C PD 100W, SD card reader",
            ImageUrl    = "https://picsum.photos/seed/ankerhub/400/400",
            IsActive    = true
        };
        usbcHub.Tags.AddRange(new[] { "hub", "usb-c", "anker", "accessory" });

        var appleWatch = new ElectronicsProduct("Apple Watch Series 10", 2199m, 35, "Apple")
        {
            CategoryId  = wearables.Id,
            Description = "Apple Watch Series 10 cu ecran mai mare, detectie fibrilatie atriala si GPS",
            ImageUrl    = "https://picsum.photos/seed/applewatch/400/400",
            IsActive    = true
        };
        appleWatch.Tags.AddRange(new[] { "smartwatch", "apple", "fitness", "wearable" });

        await context.Products.AddRangeAsync(
            iphone16Pro, iphone15, galaxyS24,
            macbookPro, dellXps,
            airpodsPro, sonyWH1000, usbcHub,
            appleWatch
        );
        await context.SaveChangesAsync();

        // ── Users ─────────────────────────────────────────────────────────────
        var adminUser = new User(
            "admin@gadgetstore.ro",
            BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            "Admin"
        );
        adminUser.UpdateProfile("Administrator", "GadgetStore", "+40 700 000 001");

        var customerUser = new User(
            "user@gadgetstore.ro",
            BCrypt.Net.BCrypt.HashPassword("User123!"),
            "Customer"
        );
        customerUser.UpdateProfile("Ion", "Popescu", "+40 700 000 002");

        await context.Users.AddRangeAsync(adminUser, customerUser);
        await context.SaveChangesAsync();

        // ── Coupons ───────────────────────────────────────────────────────────
        var summer20 = new Coupon(
            code: "SUMMER20",
            type: "Percentage",
            value: 20m,
            minOrderAmount: 500m,
            expiresAt: new DateTime(2026, 8, 31, 23, 59, 59),
            maxUses: 500
        );

        var welcome50 = new Coupon(
            code: "WELCOME50",
            type: "Fixed",
            value: 50m,
            minOrderAmount: 200m,
            expiresAt: new DateTime(2026, 12, 31, 23, 59, 59),
            maxUses: 1000
        );

        var flash100 = new Coupon(
            code: "FLASH100",
            type: "Fixed",
            value: 100m,
            minOrderAmount: 1000m,
            expiresAt: new DateTime(2026, 6, 30, 23, 59, 59),
            maxUses: 100
        );

        await context.Coupons.AddRangeAsync(summer20, welcome50, flash100);
        await context.SaveChangesAsync();
    }
}
