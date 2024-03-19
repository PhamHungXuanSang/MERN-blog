export default async function checkCreatePermission(userId) {
    try {
        // Gọi api truyền vào userId
        const res = await fetch(`/api/transaction/checkCreatePermission/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (res.status === 403) {
            return false;
        } else if (res.status === 200) {
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}
