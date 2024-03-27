export default function dateToDateAndTime(inputDate) {
    let date = new Date(inputDate);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 7 * 60); // Điều chỉnh múi giờ đến GMT+7

    const pad = (num) => (num < 10 ? '0' + num : num);
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const day = pad(date.getDate());
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds}, ${day} ${month} ${year}`;
}
