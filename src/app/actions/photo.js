import axios from "axios";
import config from 'config';
import storage, {keys} from 'misc/storage';
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
    ERROR_RECEIVE_PHOTOS_PAGINATION,
    REQUEST_PHOTOS_PAGINATION,
    RECEIVE_PHOTOS_PAGINATION, REQUEST_UPDATE_PHOTO, ERROR_UPDATE_PHOTO, SUCCESS_UPDATE_PHOTO
} from '../constants/actionTypes';

const errorReceivePhoto = (errors) => ({
    payload: errors,
    type: ERROR_RECEIVE_PHOTO
});
const requestPhoto = () => ({
    type: REQUEST_PHOTO
});

const receivePhoto = (photo) => ({
    payload: photo,
    type: RECEIVE_PHOTO
});

const errorUploadPhoto = (errors) => ({
    payload: errors,
    type: ERROR_UPLOAD_PHOTO
});
const requestUploadPhoto = () => ({
    type: REQUEST_UPLOAD_PHOTO
});

const successUploadPhoto = () => ({
    type: SUCCESS_UPLOAD_PHOTO
});

const errorDeletePhoto = (errors) => ({
    payload: errors,
    type: ERROR_DELETE_PHOTO
});
const requestDeletePhoto = () => ({
    type: REQUEST_DELETE_PHOTO
});

const successDeletePhoto = () => ({
    type: SUCCESS_DELETE_PHOTO
});

const errorReceivePhotosPagination = (errors) => ({
    payload: errors,
    type: ERROR_RECEIVE_PHOTOS_PAGINATION
});
const requestPhotosPagination = () => ({
    type: REQUEST_PHOTOS_PAGINATION
});

const receivePhotosPagination = (photos) => ({
    payload: photos,
    type: RECEIVE_PHOTOS_PAGINATION
});

const errorUpdatePhoto = (errors) => ({
    payload: errors,
    type: ERROR_UPDATE_PHOTO
});
const requestUpdatePhoto = () => ({
    type: REQUEST_UPDATE_PHOTO
});

const successUpdatePhoto = () => ({
    type: SUCCESS_UPDATE_PHOTO
});

const uploadPhoto = (photoName, photoDescription, photoTags, file, userId) => {
    const {PHOTOS_SERVICE} = config;
    const formData = new FormData();
    formData.append('photoName', photoName);
    formData.append('file', file);
    formData.append("userId", userId);
    if (photoDescription) formData.append('photoDescription', photoDescription);
    if (photoTags) formData.append('photoTags', photoTags);
    return axios.post(`${PHOTOS_SERVICE}`, formData);
}


const updatePhoto = (id, photoName, photoDescription, photoTags) => {
    const {PHOTOS_SERVICE} = config;
    const formData = new FormData();
    if (photoName) formData.append('photoName', photoName);
    if (photoDescription) formData.append('photoDescription', photoDescription);
    if (photoTags) formData.append('photoTags', photoTags);
    return axios.put(`${PHOTOS_SERVICE}/${id}`, formData);
}

const getPhoto = (id) => {
    const {PHOTOS_SERVICE} = config;
    return axios.get(`${PHOTOS_SERVICE}/${id}`);
};


const listPhotos = ({
                        page,
                        size,
                        photoName,
                        photoFormat,
                        uploadDate
                    }) => {
    const {PHOTOS_SERVICE} = config;
    const formData = new FormData();
    if (page) formData.append('page', page.toString());
    formData.append('size', size.toString());
    if (photoName) formData.append('photoName', photoName.toString());
    if (photoFormat) formData.append('photoFormat', photoFormat.toString());
    if (uploadDate) formData.append('uploadDate', uploadDate.toString());
    return axios.post(`${PHOTOS_SERVICE}/_list`, formData);
};

const deletePhoto = (id) => {
    const {PHOTOS_SERVICE} = config;
    return axios.delete(`${PHOTOS_SERVICE}/${id}`);
};

const fetchDeletePhoto = (id) => (dispatch) => {
    dispatch(requestDeletePhoto());
    return deletePhoto(id)
        .catch((data) => {
            if (data.status === 400) {
                return Promise.reject([{
                    code: 'ENTITY_NOT_FOUND',
                }])
            } else if (data.status === 500) {
                return Promise.reject([{
                    code: 'ETERNAL_SERVER_ERROR',
                }])
            }
        })
        .then(() => dispatch(successDeletePhoto()))
        .catch((error) => {
            dispatch(errorDeletePhoto(error))
        });
}


const fetchPhotosPagination = (payload) => (dispatch) => {
    dispatch(requestPhotosPagination());
    const {page, size, photoName, photoFormat, uploadDate} = payload;
    return listPhotos({
        page,
        size,
        photoName,
        photoFormat,
        uploadDate
    }).then((photos) => dispatch(receivePhotosPagination(photos)))
        .catch((errors) => dispatch(errorReceivePhotosPagination(errors)));
};

const fetchGetPhoto = (id) => (dispatch) => {
    dispatch(requestPhoto());
    return getPhoto(id).catch((error) => {
        if (error.status === 400) {
            return Promise.reject([{
                code: 'ENTITY_NOT_FOUND',
            }])
        } else if (error.status === 500) {
            return Promise.reject([{
                code: 'ETERNAL_SERVER_ERROR',
            }])
        }
    })
        .then((photo) => dispatch(receivePhoto(photo)))
        .catch((errors) => dispatch(errorReceivePhoto(errors)));
};

const fetchUpdatePhoto = (payload) => (dispatch) => {
    const {id, photoName, photoDescription, photoTags} = payload;
    dispatch(requestUpdatePhoto());
    return updatePhoto(id, photoName, photoDescription, photoTags).catch((error) => {
        if (error.status === 400) {
            return Promise.reject([{
                code: 'ENTITY_NOT_FOUND',
            }])
        } else if (error.status === 500) {
            return Promise.reject([{
                code: 'INTERNAL_SERVER_ERROR',
            }])
        }
    })
        .then(() => dispatch(successUpdatePhoto()))
        .catch((errors) => dispatch(errorUpdatePhoto(errors)));
};


const fetchUploadPhoto = (payload) => (dispatch) => {
    const {photoName, photoDescription, photoTags, file, userId} = payload;
    dispatch(requestUploadPhoto());
    console.log(payload);
    return uploadPhoto(photoName, photoDescription, photoTags, file, userId).catch((error) => {
        if (error.status === 400) {
            return Promise.reject([{
                code: 'ENTITY_NOT_FOUND',
            }])
        } else if (error.status === 500) {
            return Promise.reject([{
                code: 'INTERNAL_SERVER_ERROR',
            }])
        }
    })
        .then(() => dispatch(successUploadPhoto()))
        .catch((errors) => dispatch(errorUploadPhoto(errors)));
}

const exportFunctions = {
    fetchPhotosPagination,
    fetchDeletePhoto,
    fetchGetPhoto,
    fetchUpdatePhoto,
    fetchUploadPhoto
};

export default exportFunctions;
