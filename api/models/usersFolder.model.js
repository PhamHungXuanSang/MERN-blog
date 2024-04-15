import mongoose, { Schema } from 'mongoose';

const UsersFolderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    folders: {
        type: [
            {
                folderName: String,
                blogIds: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
            },
        ],
        default: [],
    },
});

const UsersFolder = mongoose.model('UsersFolder', UsersFolderSchema);

export default UsersFolder;
