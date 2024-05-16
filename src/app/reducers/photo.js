import {
    ERROR_RECEIVE_PHOTO,
    REQUEST_PHOTO,
    RECEIVE_PHOTO,
    ERROR_UPLOAD_PHOTO,
    REQUEST_UPLOAD_PHOTO,
    SUCCESS_UPLOAD_PHOTO,
    ERROR_DELETE_PHOTO,
    REQUEST_DELETE_PHOTO,
    SUCCESS_DELETE_PHOTO,
    REQUEST_PHOTOS_PAGINATION,
    RECEIVE_PHOTOS_PAGINATION,
    ERROR_RECEIVE_PHOTOS_PAGINATION, ERROR_UPDATE_PHOTO, REQUEST_UPDATE_PHOTO, SUCCESS_UPDATE_PHOTO

} from '../constants/actionTypes';

const initialState = {
    id: 0,
    photoName: '',
    photoFormat: '',
    photoPath: '',
    photoDescription: '',
    photoTags: '',
    uploadDate: '',
    userId: 0,
    errorsPhoto: [],
    isFailedUpload: false,
    isFailedDelete: false,
    isFetchingUpload: false,
    isFetchingDelete: false,
    isFetchingPhoto: false,
    isFailedUpdate: false,
    isFetchingUpdate: false,
    isSuccessDelete: false,
};

const convertErrors = errors =>
    errors.map(error => ({
        code: error.code,
        description: error.description,
    }));
export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case ERROR_RECEIVE_PHOTO: {
            return {
                ...state,
                errorsPhoto: convertErrors(action.payload),
                isFailedUpload: true,
                isFetchingUpload: false,
            };
        }

        case REQUEST_PHOTO: {
            return {
                ...state,
                isFetchingPhoto: true,
            };
        }

        case RECEIVE_PHOTO: {
            const photo = action.payload;
            return {
                ...state,
                id: photo.id || initialState.id,
                photoName: photo.photoName || initialState.photoName,
                photoFormat: photo.photoFormat || initialState.photoFormat,
                photoPath: photo.photoPath || initialState.photoPath,
                photoDescription: photo.photoDescription || initialState.photoDescription,
                photoTags: photo.photoTags || initialState.photoTags,
                uploadDate: photo.uploadDate || initialState.uploadDate,
                userId: photo.userId || initialState.userId,
                isFetchingPhoto: false,
            };
        }

        case ERROR_UPLOAD_PHOTO: {
            return {
                ...state,
                errorsPhoto: convertErrors(action.payload),
                isFailedUpload: true,
                isFetchingUpload: false,
            };
        }

        case REQUEST_UPLOAD_PHOTO: {
            return {
                ...state,
                isFetchingUpload: true,
            };
        }

        case SUCCESS_UPLOAD_PHOTO: {
            return {
                ...state,
                isFailedUpload: false,
                isFetchingUpload: false,
            };
        }

        case ERROR_DELETE_PHOTO: {
            return {
                ...state,
                errorsPhoto: convertErrors(action.payload),
                isFailedDelete: true,
                isFetchingDelete: false,
            };
        }

        case REQUEST_DELETE_PHOTO: {
            return {
                ...state,
                isFetchingDelete: true,
            };
        }

        case SUCCESS_DELETE_PHOTO: {
            return {
                ...state,
                isSuccessDelete: true,
                isFailedDelete: false,
                isFetchingDelete: false,
            };
        }

        case REQUEST_PHOTOS_PAGINATION: {
            return {
                ...state,
                isFetchingPhoto: true,
            };
        }

        case ERROR_RECEIVE_PHOTOS_PAGINATION: {
            const error = action.payload && action.payload.error;
            if (!error) {
                return state;
            }
            return {
                ...state,
                errorsPhoto: convertErrors(error),
                isFailedUpload: true,
                isFetchingUpload: false,
            };
        }

        case RECEIVE_PHOTOS_PAGINATION: {
            const {list: photos, totalPages: totalPages} = action.payload;
            return {
                ...state,
                photos: photos.map(photo => ({
                    id: photo.id || initialState.id,
                    photoName: photo.photoName || initialState.photoName,
                    photoFormat: photo.photoFormat || initialState.photoFormat,
                    photoPath: photo.photoPath || initialState.photoPath,
                    photoDescription: photo.photoDescription || initialState.photoDescription,
                    photoTags: photo.photoTags || initialState.photoTags,
                    uploadDate: photo.uploadDate || initialState.uploadDate,
                    userId: photo.userId || initialState.userId,
                })),
                totalPages: totalPages,
                isFetchingPhoto: false,
            };
        }

        case ERROR_UPDATE_PHOTO: {
            return {
                ...state,
                errorsPhoto: convertErrors(action.payload),
                isFailedUpdate: true,
                isFetchingUpdate: false,
            }
        }

        case REQUEST_UPDATE_PHOTO: {
            return {
                ...state,
                isFetchingUpdate: true,
            }
        }

        case SUCCESS_UPDATE_PHOTO: {
            return {
                ...state,
                isFailedUpdate: false,
                isFetchingUpdate: false,
            }
        }

        default:
            return state;
    }
}
