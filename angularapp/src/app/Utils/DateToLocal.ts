export function DateToLocal(date : Date) {
    const dateStrings = date.toLocaleString("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit", 
        hour12: false,
    }).split(',');
    return dateStrings[0] + dateStrings[1];
}