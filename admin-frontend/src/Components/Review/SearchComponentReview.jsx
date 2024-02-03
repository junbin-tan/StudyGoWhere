import React from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

export default function SearchComponentReview({changeSearch, handleCategoryChange}) {
    return (
      <div className='col-span-10'>
        <form>
          <FormControl variant="standard" sx={{ m: 1, width: '30ch' }}>
            <TextField 
              id="standard-basic" 
              label="Search Review" 
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
              <MenuItem value={"subject"}>Subject</MenuItem>
              <MenuItem value={"student"}>Student</MenuItem>
              <MenuItem value={"starRating"}>Rating</MenuItem>
              <MenuItem value={"venue"}>Venue</MenuItem>
              {/* <MenuItem value={"createdAt"}>Created At</MenuItem> */}
            </Select>
          </FormControl>
        </form>
      </div>
    );
}
