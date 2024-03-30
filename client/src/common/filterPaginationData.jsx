export const filterPaginationData = async ({
    createNewArr = false,
    state,
    data,
    page,
    countRoute,
    dataToSend = {},
}) => {
    // component này để thực hiện logic phân trang
    let obj;
    if (state != null && !createNewArr) {
        obj = { ...state, results: [...state.results, ...data], page: page };
    } else {
        try {
            const res = await fetch(`${countRoute}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
            const data = await res.json();
            // console.log(data);
            // obj = { results: data, page: 1, totalDocs: data.totalDocs };
            obj = { results: [...data.notifications], page: 1, totalDocs: data.totalDocs };
        } catch (error) {
            console.log(error);
        }
    }
    return obj;
};
