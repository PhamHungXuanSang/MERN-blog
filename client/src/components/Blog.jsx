export default function Blog({ blogInfo }) {
    return (
        <div className="text-3xl text-red-500">
            {blogInfo.map((blog, index) => (
                <div key={index}>
                    <h2>{blog.title}</h2>
                </div>
            ))}
        </div>
    );
}
