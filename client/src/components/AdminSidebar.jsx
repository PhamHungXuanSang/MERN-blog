import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineUserGroup, HiDocumentText } from 'react-icons/hi';
import { TbBusinessplan } from 'react-icons/tb';
import { FcStatistics } from 'react-icons/fc';
import { BiSolidCartAdd } from 'react-icons/bi';

export default function AdminSideBar() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    //const currentUser = useSelector((state) => state.user.currentUser);
    //const dispatch = useDispatch();

    //   useEffect(() => {
    //       const setCreatePermission = async () => {
    //           const rs = await checkCreatePermission(currentUser._id);
    //           if (rs) {
    //               // Nếu về data thì gọi hàm set lại currentUser trong redux
    //               dispatch(setCurrentUser(rs));
    //           }
    //       };

    //       setCreatePermission();
    //   }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    return (
        <Sidebar aria-label="Sidebar with content separator example" className="w-full">
            <Sidebar.Items className="pt-8">
                <Sidebar.ItemGroup>
                    <span className="text-3xl font-semibold pb-2 pl-2">Business</span>
                    <Link to="/admin?tab=main-board">
                        <Sidebar.Item active={tab === 'main-board'} icon={FcStatistics} as="div" className="mt-2">
                            Overview
                        </Sidebar.Item>
                    </Link>
                    <Link to="/admin?tab=revenue">
                        <Sidebar.Item
                            className="mt-1"
                            label={tab === 'revenue' ? '' : 'Chart'}
                            active={tab === 'revenue' || tab === 'revenue-each-package'}
                            icon={TbBusinessplan}
                            as="div"
                        >
                            Revenue
                        </Sidebar.Item>
                    </Link>
                    <Link to="/admin?tab=new-package">
                        <Sidebar.Item className="mt-1" active={tab === 'new-package'} icon={BiSolidCartAdd} as="div">
                            New Package
                        </Sidebar.Item>
                    </Link>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <span className="text-3xl font-semibold pb-2 pl-2">Blog</span>
                    <Link to="/admin?tab=blog-management">
                        <Sidebar.Item
                            active={tab === 'blog-management'}
                            icon={HiDocumentText}
                            as="div"
                            className="mt-2"
                        >
                            Blog Management
                        </Sidebar.Item>
                    </Link>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <span className="text-3xl font-semibold pb-2 pl-2">User</span>
                    <Link to="/admin?tab=user-management">
                        <Sidebar.Item
                            active={tab === 'user-management'}
                            icon={HiOutlineUserGroup}
                            as="div"
                            className="mt-2"
                        >
                            User Management
                        </Sidebar.Item>
                    </Link>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}