import React, {useEffect, useState} from 'react';
import Typography from 'components/Typography';
import ListComponent from 'components/List';
import {useDispatch} from 'react-redux';
import actionPhoto from 'app/actions/photo';
import PaginationBar from 'components/PaginationBar';
import useCurrentPage from 'misc/hooks/useCurrentPage';
import {format} from 'date-fns';
import {Dialog, DialogActions, DialogContent, DialogTitle, Snackbar} from "@mui/material";
import Button from "../../../components/Button";
import {useIntl} from "react-intl";
import * as errorCodes from "../../../pages/default/constants/errorCodes";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import Link from "../../../components/Link";
import pagesURLs from "../../../constants/pagesURLs";
import * as pages from "../../../constants/pages";
import {useParams, useNavigate} from "react-router-dom";
import * as storage from "../../../misc/storage"
import TextField from "../../../components/TextField";

function Default({errors, isFailedDelete, isSuccessDelete}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [state, setState] = useState({
        externalErrors: [],
        isFetchingDelete: false,
        isFailedDelete: false,
        isSuccessDelete: false
    });
    const [data, setData] = useState(false);
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(Number(storage.default.getItem("currentPage")) || 1);
    const [photoName, setPhotoName] = useState(storage.default.getItem("formatedFilters") ? storage.default.getItem("formatedFilters").split(",")[0] : "");
    const [photoFormat, setPhotoFormat] = useState(storage.default.getItem("formatedFilters") ? storage.default.getItem("formatedFilters").split(",")[1] : "");
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [id, setId] = React.useState(null);
    const [openFilterDialog, setOpenFilterDialog] = React.useState(false);
    const {formatMessage} = useIntl();

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
        if (isSuccessDelete) {
            setOpenDialog(false);
            setOpenSnackbar(true);
        }
    }, [isSuccessDelete]);

    useEffect(() => {
        if (isFailedDelete) {
            const errorCodeValues = Object.values(errorCodes);
            const messages = errors.map(error => errorCodeValues.includes(error.code)
                ? formatMessage({id: `error.${error.code}`})
                : error.description);
            setState({
                ...state,
                externalErrors: messages,
            })
        }
    }, [isFailedDelete, errors, isSuccessDelete]);


    const fetchData = async () => {

        const payload = {
            page: currentPage - 1,
            size: 10,
            photoName: photoName === "" ? undefined : photoName,
            photoFormat: photoFormat === "" ? undefined : photoFormat
        };
        const photos = await dispatch(actionPhoto.fetchPhotosPagination(payload));
        setItems(photos);
    };


    const fetchDelete = async (id) => {

        const data = await dispatch(actionPhoto.fetchDeletePhoto(id));
        fetchData();
    };

    useEffect(() => {
        let fields = storage.default.getItem("formatedFilters");
        if (fields) {
            navigate({pathname: `${pagesURLs[pages.defaultPage]}/${currentPage}/${fields}`});
        } else {
            navigate({pathname: `${pagesURLs[pages.defaultPage]}/${currentPage}`});
        }
        storage.default.setItem("currentPage", currentPage);
        fetchData();
    }, [dispatch, actionPhoto.fetchPhotosPagination, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleOpenDialog = (open, id) => {
        setOpenDialog(open);
        setId(id);
    };

    const handleInputNameChange = (e) => {
        setPhotoName(e.target.value);
    };
    const handleInputFormatChange = (e) => {
        setPhotoFormat(e.target.value);
    };

    return (
        <Typography>
            <div style={{display: 'flex', flexDirection: 'row', gap: '30px', justifyContent: 'end'}}>
                <Button variant={'text'} children={<TuneOutlinedIcon/>} onClick={() => {
                    setOpenFilterDialog(true);
                }}/>
                <Link to={{pathname: `${pagesURLs[pages.entityDetailPage]}/upload`}}>
                    <Button variant={'text'} children={<AddBoxOutlinedIcon/>}/>
                </Link>
            </div>
            <ListComponent items={items} handleDialog={handleOpenDialog}/>
            {items.payload && items.payload.totalPages && (
                <PaginationBar totalPages={items.payload.totalPages} currentPage={currentPage}
                               onPageChange={handlePageChange}/>
            )}
            <Dialog open={openDialog}>
                <DialogTitle>{formatMessage({id: 'delete.title'})}</DialogTitle>
                <DialogContent>
                    {isFailedDelete && !!state.externalErrors.length && (
                        <div>
                            {state.externalErrors.map(errorMessage => (
                                <Typography color="error">
                                    {errorMessage}
                                </Typography>
                            ))}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant={'text'}
                            onClick={() => {
                                setOpenDialog(false);
                                setState(
                                    {
                                        ...state,
                                        externalErrors: []
                                    }
                                )
                            }}>{formatMessage({id: 'delete.cancel'})}</Button>
                    <Button variant={'text'} onClick={() => {
                        fetchDelete(id);

                    }} disabled={isFailedDelete}>{formatMessage({id: 'delete.accept'})}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openFilterDialog}>
                <DialogTitle>{formatMessage({id: 'filter.title'})}</DialogTitle>
                <DialogContent>
                    <TextField type={"text"} value={photoName || ""} label={formatMessage({id: 'filter.name.label'})}
                               onChange={handleInputNameChange}/>
                    <TextField type={"text"} value={photoFormat || ""}
                               label={formatMessage({id: 'filter.format.label'})}
                               onChange={handleInputFormatChange}/>
                </DialogContent>
                <DialogActions>
                    <Button variant={'text'}
                            onClick={() => {
                                setOpenFilterDialog(false);
                            }}>{formatMessage({id: 'delete.cancel'})}</Button>
                    <Button variant={'text'} onClick={() => {
                        let formatedFilters = "";
                        if ((photoName && photoName.trim()) || (photoFormat && photoFormat.trim())) {
                            formatedFilters = `${(photoName && photoName.trim()) || ""},${(photoFormat && photoFormat.trim()) || ""}`;
                        }
                        if (formatedFilters.length) {
                            storage.default.setItem("formatedFilters", formatedFilters);
                            setCurrentPage(1);
                            navigate({pathname: `${pagesURLs[pages.defaultPage]}/${currentPage}/${formatedFilters}`});
                        } else {
                            storage.default.removeItem("formatedFilters");
                            navigate({pathname: `${pagesURLs[pages.defaultPage]}/${currentPage}`});
                        }
                        fetchData();
                        setOpenFilterDialog(false)
                    }
                    }>{formatMessage({id: 'filter.success'})}</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar}
                      autoHideDuration={6000}
                      onClose={() => setOpenSnackbar(false)}>
                <div style={{background: 'white'}}>Item deleted successfully</div>
            </Snackbar>
        </Typography>
    );
}

export default Default;
