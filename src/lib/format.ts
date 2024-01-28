export function formatPrice(price: number) {
    return (price / 100).toLocaleString("en-SG", {
        style: "currency",
        currency: "SGD"
    })
} 