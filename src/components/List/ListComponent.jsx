import React from 'react';
import Loading from "../Loading";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Tooltip} from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Button from "../Button";
import * as pages from "../../constants/pages";
import pagesURLs from "../../constants/pagesURLs";
import Link from "../Link";
import Typography from "../Typography";


function ListComponent({items, handleDialog}) {


    const handleDelete = (id) => {
        handleDialog(true, id);
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <List style={{display: 'flex', flexDirection: 'column', listStyle: 'none', height: '650px'}}>
                {items && items.payload && items.payload.list ? (
                    items.payload.list.map((item) => (
                        <Tooltip title={
                            <Button variant={'text'} onClick={() => handleDelete(item.id)}><DeleteOutlineOutlinedIcon
                                style={{color: 'white'}}/>
                            </Button>}
                                 placement="right" arrow={true}>
                            <ListItem key={item.id} style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '10px',
                                width: 'fit-content'
                            }}>
                                <ListItemText primary={
                                    <Link to={{pathname: `${pagesURLs[pages.entityDetailPage]}/detail/${item.id}`}}
                                          children={
                                              <Typography>
                                                  {item.photoName}
                                              </Typography>
                                          }/>
                                }
                                              secondary={item.uploadDate + " " + item.photoFormat}></ListItemText>
                            </ListItem>
                        </Tooltip>
                    ))
                ) : (
                    <Loading/>
                )}
            </List>
        </div>
    );
}

export default ListComponent;


