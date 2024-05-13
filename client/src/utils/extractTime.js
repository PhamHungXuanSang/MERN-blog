export function extractTime(dateString) {
    const date = new Date(dateString);
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    // Đoạn thêm vào
    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1); // getMonth() trả về 0-11
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Trả về thời gian và ngày theo định dạng DD/MM/YYYY HH:mm
    return `${formattedDate} ${hours}:${minutes}`;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
    return number.toString().padStart(2, '0');
}
