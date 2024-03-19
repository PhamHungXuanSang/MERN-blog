import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
        <Sidebar aria-label="Sidebar with content separator example" className="w-full md:w-56">
            <Sidebar.Items className="pt-8">
                <Sidebar.ItemGroup>
                    <span className="text-3xl font-semibold pb-2 pl-2">Management</span>
                    <Link to="/admin?tab=kinhte-management">
                        <Sidebar.Item
                            active={tab === 'kinhte-management'}
                            label={'Statistical'}
                            labelColor="dark"
                            as="div"
                            className="mt-2"
                        >
                            Kinh tế
                        </Sidebar.Item>
                    </Link>
                    <Link to="/admin?tab=package-management">
                        <Sidebar.Item
                            className="mt-1"
                            active={tab === 'package-management'}
                            label={'Package'}
                            labelColor="dark"
                            as="div"
                        >
                            Package
                        </Sidebar.Item>
                    </Link>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <span className="text-3xl font-semibold pb-2 pl-2">Blog</span>
                    <Link to="/admin?tab=blog-management">
                        <Sidebar.Item
                            active={tab === 'blog-management'}
                            label={'All'}
                            labelColor="dark"
                            as="div"
                            className="mt-2"
                        >
                            Blog Management
                        </Sidebar.Item>
                    </Link>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
