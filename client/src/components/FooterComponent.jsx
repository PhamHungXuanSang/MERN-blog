import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function FooterComponent() {
    return (
        <Footer container className="border border-t-8 border-teal-500">
            <div className="w-full container mx-auto">
                <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1 overflow-hidden">
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
                                <Footer.Link
                                    href="https://www.facebook.com/profile.php?id=100007950550444"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Facebook
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d804.3857672353058!2d107.59218743380431!3d16.45906757952146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3141a13f56053523%3A0xf1263198c4505b06!2zNzcgTmd1eeG7hW4gSHXhu4csIFBow7ogTmh14bqtbiwgVGjDoG5oIHBo4buRIEh14bq_LCBUaOG7q2EgVGhpw6puIEh14bq_LCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1714064243432!5m2!1svi!2s"
                            width="300"
                            height="200"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-lg overflow-hidden"
                        ></iframe>
                        <div className="mt-2">Phone number: +84 858630304</div>
                        <div className="mt-2">Address: 77 Nguyen Hue, Hue, VietNam</div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full text-center">
                    <Footer.Copyright href="#" by="Pham Hung Xuan Sang™" year={new Date().getFullYear()} />
                </div>
            </div>
        </Footer>
    );
}
