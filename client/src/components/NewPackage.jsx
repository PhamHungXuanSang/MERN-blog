import { Button, Label, Spinner, Table, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CiCircleRemove } from 'react-icons/ci';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NotFound from './NotFound.jsx';
import ModalConfirm from './ModalConfirm.jsx';

export default function PackageManagement() {
    const [formData, setFormData] = useState({});
    const [list, setList] = useState(['']);
    const [packages, setPackages] = useState(null);
    const [packageIdToBlock, setPackageIdToBlock] = useState('');
    const [showBlockModal, setShowBlockModal] = useState(false);

    const currentUser = useSelector((state) => state.user.currentUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const getAllPackage = async () => {
            const res = await fetch(`/api/package/get-all-packages`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            setPackages(data.packages);
        };

        getAllPackage();
    }, []);

    const handleType = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleChange = (e, index) => {
        if (list.includes(e.target.value) && list.length != 1) {
            return toast.error('Please do not enter duplicate package description', { duration: 6000 });
        }
        const newList = [...list];
        newList[index] = e.target.value;
        setList(newList);
    };

    const handleAdd = () => {
        if (list[list.length - 1] == '') {
            return toast.error('Please enter package description', { duration: 6000 });
        }
        setList([...list, '']);
    };

    const handleRemove = (index) => {
        const newList = [...list];
        newList.splice(index, 1);
        setList(newList);
    };

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }
        if (Object.keys(formData).length === 0 || list[list.length - 1] == '') {
            return toast.error('Please enter value to submit', { duration: 3000 });
        }
        if (!formData.packageExpiry) {
            return toast.error('Please choose expire time', { duration: 3000 });
        }
        try {
            const res = await fetch(`/api/package/add-new-package`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, packageDescription: list }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.ok) {
                setPackages(data.allPackages);
                toast.success('New package has been created 👍', { duration: 4000 });
            } else {
                return toast.error(data.message, { duration: 6000 });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBlockPackage = async () => {
        setShowBlockModal(false);
        try {
            const res = await fetch(`/api/package/block-package/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageId: packageIdToBlock }),
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
                setPackages(data.allPackages);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="py-8 px-4">
            <div className="w-full h-fit border-b-2 border-neutral-300">
                <p className="border-b-2 text-lg w-fit py-2 px-4">New Package</p>
            </div>

            <form className="mt-4 px-4">
                <div className="flex gap-10">
                    <div className="flex gap-4 items-center">
                        <div className="mb-2 block">
                            <Label htmlFor="packageName" value="Name" />
                        </div>
                        <TextInput id="packageName" placeholder="Package name" maxLength={50} onChange={handleType} />
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="mb-2 block">
                            <Label htmlFor="packagePrice" value="Price" />
                        </div>
                        <TextInput
                            className="spin-button-none"
                            id="packagePrice"
                            type="number"
                            min={0}
                            placeholder="Package price (USD)"
                            onChange={handleType}
                        />
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="mb-2 block">
                            <Label htmlFor="packageExpiry" value="Expire" />
                        </div>
                        <TextInput
                            className="spin-button-none w-[200px]"
                            id="packageExpiry"
                            type="number"
                            min={1}
                            max={365}
                            placeholder="Package expires (day)"
                            onChange={handleType}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <div className="block">
                        <Label htmlFor="packageDescription" value="Package Description" />
                    </div>
                    <div>
                        {list.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <TextInput
                                    className="w-fit mt-1"
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleChange(e, index)}
                                />
                                {index !== 0 && (
                                    <button type="button" onClick={() => handleRemove(index)}>
                                        <CiCircleRemove size={28} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button outline gradientDuoTone="pinkToOrange" type="button" onClick={handleAdd}>
                        Add desc
                    </Button>
                    <Button onClick={handleSubmit} outline gradientDuoTone={'greenToBlue'} type="submit">
                        Create new package
                    </Button>
                </div>
            </form>
            {packages != null ? (
                packages?.length > 0 ? (
                    <>
                        <Table hoverable className="shadow-md mt-6 text-center" striped>
                            <Table.Head>
                                <Table.HeadCell>Num</Table.HeadCell>
                                <Table.HeadCell>Package Name</Table.HeadCell>
                                <Table.HeadCell>Package Price</Table.HeadCell>
                                <Table.HeadCell>Days</Table.HeadCell>
                                <Table.HeadCell>Block</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {packages?.map((pack, i) => {
                                    return (
                                        <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell>{i + 1}</Table.Cell>
                                            <Table.Cell>{pack.packageName}</Table.Cell>
                                            <Table.Cell>{pack.packagePrice}</Table.Cell>
                                            <Table.Cell>
                                                {pack.packageExpiry <= 365 ? pack.packageExpiry : 'Lifetime use'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span
                                                    onClick={() => {
                                                        setShowBlockModal(true);
                                                        setPackageIdToBlock(pack._id);
                                                    }}
                                                    className="text-teal-300 font-medium hover:underline cursor-pointer"
                                                >
                                                    {pack.isBlocked ? 'UnBlocked' : 'Block'}
                                                </span>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </>
                ) : (
                    <NotFound object={'No packages found'} />
                )
            ) : (
                <Spinner className="block mx-auto mt-4" size="xl" />
            )}
            <ModalConfirm
                showModal={showBlockModal}
                setShowModal={setShowBlockModal}
                title={`You definitely want to block this package?`}
                onConfirm={handleBlockPackage}
                onNoConfirm={() => setShowBlockModal(false)}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
        </div>
    );
}
