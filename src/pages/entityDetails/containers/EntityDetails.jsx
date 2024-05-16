import {useIntl} from 'react-intl';
import React, {useEffect, useState} from 'react';
import * as errorCodes from '../../../pages/entityDetails/constants/errorCodes';
import Card from "../../../components/Card";
import CardTitle from "../../../components/CardTitle";
import Typography from "../../../components/Typography";
import CardContent from "../../../components/CardContent";
import Link from "../../../components/Link";
import Button from "../../../components/Button";
import pagesURLs from "../../../constants/pagesURLs";
import * as pages from "../../../constants/pages";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import actionPhoto from "../../../app/actions/photo";
import Loading from "../../../components/Loading";
import TextField from "../../../components/TextField";
import {Dialog, DialogActions, DialogTitle, Snackbar} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {styled} from '@mui/material/styles';
import * as storage from "../../../misc/storage"

const flexRowStyle = {
    display: "flex",
    flexDirection: "row"
};

const flexColumnStyle = {
    display: "flex",
    flexDirection: "column"
}
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function EntityDetails({errors, isFailedUpload, isFailedUpdate}) {
    const navigate = useNavigate();
    const {formatMessage} = useIntl();
    const dispatch = useDispatch();
    const {id} = useParams();
    const [state, setState] = useState({
        externalErrors: [],
        isFailedUpload: false,
        isFailedUpdate: false
    });
    const [editMode, setEditMode] = useState(false);
    const [uploadMode, setUploadMode] = useState(false);
    const [photoData, setPhotoData] = useState({});
    const [photoTags, setPhotoTags] = useState("");
    const [inputPhotoName, setInputPhotoName] = useState(photoData.photoName ? photoData.photoName : "");
    const [inputPhotoDescription, setInputPhotoDescription] = useState(photoData.photoDescription ? photoData.photoDescription : "");
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [file, setFile] = useState(null);

    const handleEditPhoto = async () => {
        const payload = {
            id: id,
            photoName: inputPhotoName ? inputPhotoName : photoData.photoName,
            photoDescription: inputPhotoDescription ? inputPhotoDescription : photoData.photoDescription,
            photoTags: photoTags ? tagConvertor(photoTags) : photoData.photoTags
        };
        const data = await dispatch(actionPhoto.fetchUpdatePhoto(payload));

    };

    const handleUploadPhoto = async () => {
        const payload = {
            userId: 2,
            photoName: inputPhotoName,
            photoDescription: inputPhotoDescription,
            photoTags: tagConvertor(photoTags),
            file: file
        };
        const data = await dispatch(actionPhoto.fetchUploadPhoto(payload));
    };

    const tagConvertor = (tags) => {
        return tags.split(',').map(tag => tag.trim().replace(/\s/g, '_')).join(', ');
    };

    const isValidPhotoName = (inputPhotoName) => {
        return inputPhotoName.trim() !== "";
    };
    useEffect(() => {
        const errorCodeValues = Object.values(errorCodes);
        const messages = errors.map(error => errorCodeValues.includes(error.code)
            ? formatMessage({id: `error.${error.code}`})
            : error.description);
        setState({
            ...state,
            externalErrors: messages,
        })
    }, [errors]);

    useEffect(() => {
        if (isFailedUpdate || isFailedUpload) {
            setOpenDialog(true);
            const errorCodeValues = Object.values(errorCodes);
            const messages = errors.map(error => errorCodeValues.includes(error.code)
                ? formatMessage({id: `error.${error.code}`})
                : error.description);
            setState({
                ...state,
                externalErrors: messages,
            })
        }
    }, [isFailedUpdate, isFailedUpload]);

    useEffect(() => {
        if (window.location.href.includes("/upload")) {
            setEditMode(true);
            setUploadMode(true);
        } else {
            fetchPhotoData();
        }
    }, [dispatch, actionPhoto.fetchGetPhoto]);

    const fetchPhotoData = async () => {
        const photo = await dispatch(actionPhoto.fetchGetPhoto(id));
        setPhotoData(photo.payload);
        setInputPhotoName(photo.payload.photoName);
        setInputPhotoDescription(photo.payload.photoDescription);
        setPhotoTags(photo.payload.photoTags);
    };


    return (
        <Card>
            <CardTitle children={<Typography variant="title"
                                             children={
                                                 uploadMode ? formatMessage({id: 'upload.title'}) :
                                                     (editMode ? formatMessage({id: 'update.title'}) : formatMessage({id: 'read.title'}))}/>}/>
            <CardContent>
                <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px', justifyContent: "end"}}>
                    {!editMode && (
                        <Button variant="contained"
                                children={<EditOutlinedIcon aria-label={formatMessage({id: 'edit'})}/>}
                                onClick={() => setEditMode(true)}/>
                    )
                    }
                </div>
                {
                    !editMode && photoData ? (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px'}}>
                            {photoData ? (
                                <div>
                                    <div style={flexRowStyle}>
                                        <Typography>
                                            {formatMessage({id: 'photoName'})} {photoData.photoName}
                                        </Typography>
                                    </div>
                                    <div style={flexRowStyle}>
                                        <Typography>
                                            {formatMessage({id: 'photoDescription'})} {photoData.photoDescription}
                                        </Typography>
                                    </div>

                                    <div style={flexRowStyle}>
                                        <Typography>
                                            {formatMessage({id: 'read.photoTags'})} {photoData.photoTags}
                                        </Typography>
                                    </div>
                                </div>) : (
                                <Loading/>
                            )}
                        </div>
                    ) : (
                        <div>
                            <TextField
                                value={inputPhotoName || ""}
                                required={true}
                                onChange={(e) => setInputPhotoName(e.target.value)}
                                label={formatMessage({id: 'photoName'})}
                                error={!isValidPhotoName(inputPhotoName)}
                                helperText={!isValidPhotoName(inputPhotoName) ? formatMessage({id: 'error.validation'}) : ''}
                            />
                            <TextField
                                value={inputPhotoDescription || ""}
                                multiline={true}
                                onChange={(e) => setInputPhotoDescription(e.target.value)}
                                label={formatMessage({id: 'photoDescription'})}
                            />
                            <TextField
                                value={photoTags || ""}
                                onChange={(e) => setPhotoTags(e.target.value)}
                                helperText={formatMessage({id: 'update.photoTags'})}
                                label={formatMessage({id: 'read.photoTags'})}
                            />
                            {
                                uploadMode && (
                                    <div>
                                        <Button
                                            component="label"
                                            role={undefined}
                                            variant="contained"
                                            tabIndex={-1}
                                            startIcon={<CloudUploadIcon/>}
                                            onClick={() => document.getElementById('fileInput').click()}
                                        >
                                            {formatMessage({id: 'upload.chooseFile.button'})}
                                            <input
                                                id="fileInput"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFile(e.target.files[0])}
                                                style={{display: 'none'}}
                                            />
                                        </Button>
                                    </div>
                                )
                            }
                            <div>

                                <Button children={formatMessage({id: 'cancel'})}
                                        onClick={() => {
                                            setEditMode(false)
                                            if (uploadMode) {
                                                navigate({pathname: `${pagesURLs[pages.defaultPage]}`});
                                            }
                                        }}/>

                                <Button
                                    children={uploadMode ? formatMessage({id: 'upload.submit'}) : formatMessage({id: 'update.submit'})}
                                    disabled={inputPhotoName.length < 2}
                                    onClick={() => {
                                        if (uploadMode) {
                                            handleUploadPhoto().then(() => {
                                                if (!state.isFailedUpload && !state.externalErrors.length) {
                                                    fetchPhotoData().then(() => {

                                                        navigate({pathname: `${pagesURLs[pages.defaultPage]}`});
                                                    });
                                                } else {
                                                    setOpenDialog(true);
                                                    setEditMode(true);
                                                    setOpenSnackbar(false);
                                                }
                                            });
                                        } else {
                                            handleEditPhoto().then(() => {
                                                if (!state.isFailedUpdate && !state.externalErrors.length) {
                                                    fetchPhotoData().then(() => {
                                                        setOpenSnackbar(true);
                                                        setEditMode(false);
                                                    });
                                                } else {
                                                    setOpenDialog(true);
                                                    setEditMode(true);
                                                    setOpenSnackbar(false);
                                                }
                                            })
                                        }
                                    }
                                    }/>

                            </div>
                        </div>
                    )
                }
                {
                    !editMode && (
                        <div style={flexColumnStyle}>
                            <Link to={{pathname: `${pagesURLs[pages.defaultPage]}`}}
                                  children={<Button children={formatMessage({id: 'goBack.button'})}/>}></Link>
                        </div>)
                }
            </CardContent>
            <Dialog open={openDialog}>
                <DialogTitle>{isFailedUpdate && !!state.externalErrors.length && (
                    <div>
                        {state.externalErrors.map(errorMessage => (
                            <Typography color="error">
                                {errorMessage}
                            </Typography>
                        ))}
                    </div>
                )}</DialogTitle>
                <DialogActions>
                    <Button variant={'text'}
                            onClick={() => {
                                setOpenDialog(false);
                                setState(
                                    {
                                        ...state,
                                        externalErrors: [],
                                        isFailedUpdate: false,
                                        isFailedUpload: false
                                    }
                                )
                            }}>{formatMessage({id: 'goBack.button'})}</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar}
                      autoHideDuration={6000}
                      onClose={() => setOpenSnackbar(false)}>
                <div style={{background: 'white'}}>{formatMessage({id: 'update.success'})}</div>
            </Snackbar>
        </Card>
    )
        ;
}

export default EntityDetails;
