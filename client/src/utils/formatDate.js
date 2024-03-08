export default function formatDate(dateString) {
    const options = { timeZone: 'Asia/Ho_Chi_Minh' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    const date = new Date(formattedDate);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    return `${day < 10 ? '0' + day : day} ${months[monthIndex]} ${year}`;
}
