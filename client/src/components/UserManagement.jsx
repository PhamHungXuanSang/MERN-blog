import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCurrentUser, signOutSuccess } from '../redux/user/userSlice.js';
import { Select, Spinner, Table } from 'flowbite-react';
import NotFound from './NotFound.jsx';
import ModalConfirm from './ModalConfirm.jsx';
import checkCreatePermission from '../utils/checkCreatePermission.js';
import toast from 'react-hot-toast';

export default function UserManagement() {
    const [users, setUsers] = useState(null);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState('');
    const [userIdToChangeRole, setUserIdToChangeRole] = useState('');
    const [role, setRole] = useState('');
    const currentUser = useSelector((state) => state.user.currentUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleGetUsers = async () => {
        try {
            const res = await fetch(`/api/user/get-all-user`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.ok) {
                setUsers(data.users);
                if (data.users.length < 2) {
                    setShowMore(false);
                }
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetUsers();
    }, []);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/get-all-user?startIndex=${startIndex}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 2) {
                    setShowMore(false);
                }
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeUserRole = async () => {
        setShowModal(false);
        const usersLength = users.length;
        try {
            const res = await fetch(`/api/user/update-user-role/${userIdToChangeRole}?usersLength=${usersLength}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('sign-in');
            }
            if (!res.ok) {
                toast.error(data.message, { duration: 6000 });
            } else {
                setUsers(data.users);
                // Gọi hàm kiểm tra createPermission
                const rs = await checkCreatePermission(currentUser._id);
                if (rs) {
                    // Nếu về data thì gọi hàm set lại currentUser trong redux
                    dispatch(setCurrentUser(rs));
                }
                toast.success(`User account has been set to ${role}`, { duration: 6000 });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="py-8 px-4 table-auto overflow-x-scroll md:mx-auto p-3 scrollbar">
            {users != null ? (
                users?.length > 0 ? (
                    <>
                        <Table hoverable className="shadow-md" striped>
                            <Table.Head>
                                <Table.HeadCell>Date created</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Avatar</Table.HeadCell>
                                <Table.HeadCell>Create Permission</Table.HeadCell>
                                <Table.HeadCell>User Role</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {users.map((user, i) => {
                                    return (
                                        <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white px-1">
                                                <Link to={`/user/${user.username}`}>{user.username}</Link>
                                            </Table.Cell>
                                            <Table.Cell className="px-1">{user.email}</Table.Cell>
                                            <Table.Cell>
                                                <Link to={`/user/${user.username}`}>
                                                    <img
                                                        src={user.userAvatar}
                                                        alt="Avatar"
                                                        className="rounded-full max-w-10 object-cover bg-gray-400 aspect-auto"
                                                    />
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell>{user.createPermission ? 'Allow' : 'Not allow'}</Table.Cell>
                                            <Table.Cell>
                                                <Select
                                                    id="roles"
                                                    required
                                                    value={user.role} // Giả sử 'role' trả về là trạng thái mới nhất sau khi được cập nhật và truyền lại vào component.
                                                    onChange={(e) => {
                                                        setTitleModal(
                                                            `You definitely want to change this user to ${e.target.value} role?`,
                                                        );
                                                        setShowModal(true);
                                                        setUserIdToChangeRole(user._id);
                                                        setRole(e.target.value);
                                                    }}
                                                >
                                                    <option
                                                        value="user"
                                                        selected={user.isAdmin ? false : user.isBlocked ? false : true}
                                                    >
                                                        User
                                                    </option>
                                                    <option value="admin" selected={user.isAdmin ? true : false}>
                                                        Admin
                                                    </option>
                                                    <option
                                                        value="blocked-user"
                                                        selected={user.isBlocked ? true : false}
                                                    >
                                                        Blocked User
                                                    </option>
                                                </Select>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                        {showMore && (
                            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                                Show more
                            </button>
                        )}
                    </>
                ) : (
                    <NotFound object={'No users found'} />
                )
            ) : (
                <Spinner className="block mx-auto mt-4" size="xl" />
            )}
            <ModalConfirm
                showModal={showModal}
                setShowModal={setShowModal} // Giả định rằng setShowModal là một hàm setState từ component cha
                title={titleModal}
                onConfirm={handleChangeUserRole}
                onNoConfirm={() => setShowModal(false)}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
        </div>
    );
}
