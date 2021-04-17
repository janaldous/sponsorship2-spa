import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import * as React from "react";

interface MenuProps {
  title: string;
}

const Menu: React.FC<MenuProps> = (props) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="h6">{props.title}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
