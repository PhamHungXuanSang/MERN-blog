export default function LoadMoreDataButton({ state, fetchDataFun, additionalParam }) {
    if (state != null && state.totalDocs > state.results.length) {
        return (
            <button
                onClick={() => fetchDataFun({ ...additionalParam, page: state.page + 1 })}
                className="text-gray-500 p-2 px-3 hover:bg-gray-300/30 rounded-md flex items-center gap-2"
            ></button>
        );
    }
}
