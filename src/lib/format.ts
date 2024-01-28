
/**
 * Function to format the price according to specific currency.
 * @param price param to take in the price as number aka Int32 format.
 * @returns string version of current price with the specific currency.
 */
export function formatPrice(price: number) {
    return (price / 100).toLocaleString("en-SG", {
        style: "currency",
        currency: "SGD"
    })
} 