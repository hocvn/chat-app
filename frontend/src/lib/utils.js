export function formatDateTime(dateTime) {
    return new Date(dateTime).toLocaleDateString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false ,
    })
}