import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button, Grid, Menu, MenuItem } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 15,
    },
    media: {
      height: 3,
    },
    avatar: {
      backgroundColor: red[500],

      width: 50,
      height: 50,
    },
  })
);

export default function CustomerCard({
  item,
  isRTL,
  onOpenView,
  onOpenEdit,
  onDeleteItem,
}: any) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card elevation={3} className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {item?.name?.substring(0, 2)?.toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton
            onClick={handleClick}
            aria-label="settings"
            aria-controls="simple-menu"
            aria-haspopup="true"
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={isRTL ? item.nameAr : item.name}
        subheader={item?.phone?.substring(3, 11)}
        // subheader={covertToDate(item?.updatedAt)}
        titleTypographyProps={{ variant: 'h5' }}
        subheaderTypographyProps={{ variant: 'subtitle1' }}
      />
      <CardMedia
        className={classes.media}
        image="/static/images/cards/paella.jpg"
        title="Paella dish"
      />
      <CardContent style={{ minHeight: 50 }}>
        {item?.email && (
          <Grid container spacing={1}>
            <Grid item xs={3}>
              {isRTL ? 'البريد الالكتروني' : 'Email'}
            </Grid>
            <Grid item xs={9}>
              {item?.email}
            </Grid>
          </Grid>
        )}
      </CardContent>
      <CardActions disableSpacing>
        <Button
          style={{ margin: 5, minWidth: 80 }}
          variant="outlined"
          size="small"
          color="primary"
          onClick={() => onOpenView(item)}
        >
          <Typography style={{ fontSize: 14 }}>
            {isRTL ? 'التفاصيل' : 'Details'}
          </Typography>
        </Button>
      </CardActions>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            onOpenEdit(item);
            handleClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDeleteItem(item._id);
            handleClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}
