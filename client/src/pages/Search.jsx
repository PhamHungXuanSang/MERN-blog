import { FaUser } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

export default function Search() {
    let { query } = useParams();
    console.log(query);

    return (
        <section className="container mx-auto min-h-screen h-fit flex justify-center gap-10">
            <div className="w-full flex py-12">
                {/* Latest blog */}
                <div className="h-full w-[70%]">
                    <div className="w-full h-fit border-b-2 border-neutral-300">
                        <p
                            className={`font-bold border-b-2 border-black dark:bg-[#4b5563] bg-[#f3f4f6] text-lg w-fit py-2 px-4 inline-block`}
                        >
                            Search result for {query}
                        </p>
                    </div>

                    {/* {blogs != null ? (
                        blogs.length == 0 ? (
                            <NotFoundBlog object={activeCate} />
                        ) : (
                            <>
                                {blogs.map((blog, i) => (
                                    <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.15 }} key={i}>
                                        <Blog key={i} content={blog} author={blog.authorId} />
                                    </OneByOneAppearEffect>
                                ))}
                                <Pagination
                                    className="text-center mt-4"
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(totalPage / limit)}
                                    onPageChange={onPageChange}
                                    showIcons
                                />
                            </>
                        )
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="xl" />
                    )} */}
                </div>

                {/* Trending and filter by category */}
                <div className="border-l-2 h-full pl-4 w-[30%] max-md:hidden">
                    <div className="flex flex-col gap-2 mb-8">
                        <div className="flex items-center">
                            <h1 className="font-medium text-xl mr-1">Search result for User</h1>
                            <FaUser />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {/* {category.map((cate, i) => {
                                return (
                                    <Button
                                        gradientDuoTone="greenToBlue"
                                        key={i}
                                        outline={activeCate == cate.toLowerCase() ? false : true}
                                        onClick={loadBlogByCategory}
                                    >
                                        {cate.toUpperCase()}
                                    </Button>
                                );
                            })} */}
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <h1 className="font-medium text-xl mr-1">Trending blogs</h1>
                        <TbTrendingUp />
                    </div>
                    {trendingBlogs != null ? (
                        trendingBlogs.length == 0 ? (
                            <NotFoundBlog object={'trending'} />
                        ) : (
                            trendingBlogs.map((blog, i) => (
                                <OneByOneAppearFromRightEffect transition={{ duration: 1, delay: i * 0.15 }} key={i}>
                                    <BlogMini key={i} index={i} content={blog} author={blog.authorId} />
                                </OneByOneAppearFromRightEffect>
                            ))
                        )
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="lg" />
                    )} */}
                </div>
            </div>
        </section>
    );
}
