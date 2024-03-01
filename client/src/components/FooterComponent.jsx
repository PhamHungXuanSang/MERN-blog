import { Footer } from 'flowbite-react';
import { BsFacebook, BsGithub } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function FooterComponent() {
    return (
        <Footer container className="border border-t-8 border-teal-500">
            <div className="w-full container mx-auto">
                <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                    <div>
                        <Link to="/" className="seft-center font-semibold text-lg sm:text-xl dark:text-white">
                            <span className="px-3 py-1 rounded-lg bg-gradient-to-tr from-green-500 to-blue-500 text-white">
                                MERN Blog
                            </span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:gap-6">
                        <div>
                            <Footer.Title title="Follow us" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="https://github.com/PhamHungXuanSang"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Github
                                </Footer.Link>
                                <Footer.Link
                                    href="https://www.youtube.com/channel/UCkQvZq6y9mui3STeU1BkN5Q"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Youtube
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="about" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">Flowbite</Footer.Link>
                                <Footer.Link href="#">Tailwind CSS</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="Pham Hung Xuan Sang™" year={new Date().getFullYear()} />
                    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <Footer.Icon href="https://www.facebook.com/profile.php?id=100007950550444" icon={BsFacebook} />
                        <Footer.Icon href="https://github.com/PhamHungXuanSang" icon={BsGithub} />
                    </div>
                </div>
            </div>
        </Footer>
    );
}
