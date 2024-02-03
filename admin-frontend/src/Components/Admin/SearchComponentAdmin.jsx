import React from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

export default function SearchComponent({changeSearch, handleCategoryChange}) {
    return (
      <div className='col-span-10'>
        <form>
          <FormControl variant="standard" sx={{ m: 1, width: '30ch' }}>
            <TextField 
              id="standard-basic" 
              label="Search Admin" 
              variant="standard" 
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                      <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={changeSearch}
            />
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, width: '30ch' }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value={"id"}>ID</MenuItem>
              <MenuItem value={"username"}>Username</MenuItem>
              <MenuItem value={"name"}>Name</MenuItem>
              <MenuItem value={"email"}>Email</MenuItem>
              <MenuItem value={"enabled"}>Enabled</MenuItem>
              {/* <MenuItem value={"createdAt"}>Created At</MenuItem> */}
            </Select>
          </FormControl>
        </form>
      </div>
    );
}
