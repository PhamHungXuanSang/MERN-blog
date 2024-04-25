import { Button, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CiCircleRemove } from 'react-icons/ci';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export default function PackageManagement() {
    const [formData, setFormData] = useState({});
    const [list, setList] = useState(['']);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleType = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleChange = (e, index) => {
        if (list.includes(e.target.value) && list.length != 1) {
            return toast.error('Please do not enter duplicate package description');
        }
        const newList = [...list];
        newList[index] = e.target.value;
        setList(newList);
    };

    const handleAdd = () => {
        if (list[list.length - 1] == '') {
            return toast.error('Please enter package description');
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
            return toast.error('Please enter value to submit');
        }
        if (!formData.packageExpiry) {
            return toast.error('Please choose expire time');
        }
        console.log('Submitted data: ', {
            ...formData,
            packageDescription: list,
        });
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
                return toast.success('New package has been created 👍');
            } else {
                console.log(data.message);
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
                <div className="flex gap-20">
                    <div className="flex gap-4 items-center mt-4">
                        <div className="mb-2 block">
                            <Label htmlFor="packageName" value="Name" />
                        </div>
                        <TextInput
                            id="packageName"
                            placeholder="Package name"
                            //defaultValue={currentUser.userDesc}
                            maxLength={50}
                            onChange={handleType}
                        />
                    </div>
                    <div className="flex gap-4 items-center mt-4">
                        <div className="mb-2 block">
                            <Label htmlFor="packagePrice" value="Price" />
                        </div>
                        <TextInput
                            className="spin-button-none"
                            id="packagePrice"
                            type="number"
                            min={0}
                            placeholder="Package price (USD)"
                            //defaultValue={currentUser.userDesc}
                            onChange={handleType}
                        />
                    </div>
                    <div className="flex gap-4 items-center mt-4">
                        <div className="mb-2 block">
                            <Label htmlFor="packageExpiry" value="Expire" />
                        </div>
                        {/* <select
                            id="packageExpiry"
                            name="packageExpiry"
                            onChange={handleType}
                            className="dark:bg-[#374151] rounded-md"
                        >
                            <option value="1m">1 Month</option>
                            <option value="2m">2 Month</option>
                            <option value="3m">3 Month</option>
                            <option value="4m">4 Month</option>
                            <option value="5m">5 Month</option>
                            <option value="6m">6 Month</option>
                            <option value="12m">12 Month</option>
                        </select> */}
                        <TextInput
                            className="spin-button-none"
                            id="packageExpiry"
                            type="number"
                            min={1}
                            max={365}
                            placeholder="Package expires in (day)"
                            //defaultValue={currentUser.userDesc}
                            onChange={handleType}
                        />
                    </div>
                </div>
                <div className="flex items-start gap-4 mt-4">
                    <div className="block">
                        <Label htmlFor="packageDescription" value="Package Description" />
                        <Button outline className="mt-2" type="button" onClick={handleAdd}>
                            Add desc
                        </Button>
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
                </div>
                <Button onClick={handleSubmit} outline type="submit" className="mt-8">
                    Create new package
                </Button>
            </form>
        </div>
    );
}
