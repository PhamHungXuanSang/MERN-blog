import { Button, Label, Spinner, Table, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import NotFound from './NotFound';
import ModalConfirm from './ModalConfirm';
import BackToTopButton from './BackToTopButton';

export default function CateManagement() {
    const [newCate, setNewCate] = useState(null);
    const [allCate, setAllCate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [cateIdToDelete, setCateIdToDelete] = useState('');
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [cateIdToBlock, setCateIdToBlock] = useState('');

    const currentUser = useSelector((state) => state.user.currentUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleType = (e) => {
        setNewCate(e.target.value);
    };

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }
        if (newCate.length <= 0) {
            return toast.error('Please enter new category name', { duration: 3000 });
        }
        document.querySelector('#cateName').value = '';
        const res = await fetch(`/api/category/add-new-category`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newCate }),
        });
        const data = await res.json();
        if (res.status === 403) {
            dispatch(signOutSuccess());
            return navigate('/sign-in');
        }
        if (res.ok) {
            setAllCate(data.allCates);
            return toast.success(data.message, { duration: 6000 });
        } else {
            return toast.error(data.message, { duration: 6000 });
        }
    };

    useEffect(() => {
        const getAllCategory = async () => {
            const res = await fetch(`/api/category/get-all-category`, {
                method: 'GET',
            });
            const data = await res.json();
            setAllCate(data.allCates);
        };
        getAllCategory();
    }, []);

    const handleDeleteCate = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/category/delete-category/${currentUser._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cateId: cateIdToDelete }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (!res.ok) {
                toast.error(data.message, { duration: 6000 });
            } else {
                toast.success(data.message, { duration: 6000 });
                setAllCate((prev) => prev.filter((cate) => cate._id !== cateIdToDelete));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBlockCate = async () => {
        setShowBlockModal(false);
        try {
            const res = await fetch(`/api/category/block-category/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cateId: cateIdToBlock }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (!res.ok) {
                return toast.error(data.message, { duration: 6000 });
            } else {
                toast.success(data.message, { duration: 6000 });
                setAllCate(data.allCates);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="py-8 px-4">
            <div className="flex items-center justify-between w-full h-fit border-b-2 border-neutral-300">
                <p className="border-b-2 text-lg w-fit py-2 px-4">Category Management</p>
                <p>
                    Rows <b>{allCate?.length}</b> of <b>{allCate?.length}</b>
                </p>
            </div>
            <form className="mt-4 px-4">
                <div className="flex gap-10">
                    <div className="flex gap-4 items-center">
                        <div className="mb-2 block">
                            <Label htmlFor="cateName" value="Category Name" />
                        </div>
                        <TextInput id="cateName" placeholder="Category name" maxLength={50} onChange={handleType} />
                    </div>
                    <Button onClick={handleSubmit} gradientDuoTone={'pinkToOrange'} outline type="submit">
                        Add new
                    </Button>
                </div>
            </form>
            {allCate != null ? (
                allCate?.length > 0 ? (
                    <>
                        <Table hoverable className="shadow-md mt-6 text-center" striped>
                            <Table.Head>
                                <Table.HeadCell>Num</Table.HeadCell>
                                <Table.HeadCell>Category Name</Table.HeadCell>
                                <Table.HeadCell>Block</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {allCate?.map((cate, i) => {
                                    return (
                                        <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell>{i + 1}</Table.Cell>
                                            <Table.Cell>{cate.categoryName}</Table.Cell>
                                            <Table.Cell>
                                                <span
                                                    onClick={() => {
                                                        setShowBlockModal(true);
                                                        setCateIdToBlock(cate._id);
                                                    }}
                                                    className={`${cate.isBlocked ? 'text-teal-300' : 'text-yellow-300'} font-medium hover:underline cursor-pointer`}
                                                >
                                                    {cate.isBlocked ? 'UnBlocked' : 'Block'}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setCateIdToDelete(cate._id);
                                                    }}
                                                    className="text-red-500 font-medium hover:underline cursor-pointer"
                                                >
                                                    Delete
                                                </span>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </>
                ) : (
                    <NotFound object={'No categories found'} />
                )
            ) : (
                <Spinner className="block mx-auto mt-4" size="xl" />
            )}
            <ModalConfirm
                showModal={showModal}
                setShowModal={setShowModal}
                title={`You definitely want to delete this category?`}
                onConfirm={handleDeleteCate}
                onNoConfirm={() => setShowModal(false)}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
            <ModalConfirm
                showModal={showBlockModal}
                setShowModal={setShowBlockModal}
                title={`You definitely want to block this category?`}
                onConfirm={handleBlockCate}
                onNoConfirm={() => setShowBlockModal(false)}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
            <BackToTopButton />
        </div>
    );
}
