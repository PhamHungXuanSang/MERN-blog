export default function dateToHour(inputDate) {
    let date = new Date(inputDate);
    // chuyển sang múi GMT+7
    date = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return date.toTimeString().split(' ')[0];
}
