import React from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

export default function SearchComponent({searchReviews, handleTextSearchChange, searchObj}) {
    const handleForm = (e) => {
        e.preventDefault();
        searchReviews();
    }
    return <div className='col-span-10'>
    <form onSubmit={handleForm}>
      <FormControl variant="standard" sx={{ m: 1, width: '30ch' }} >
          <TextField id="standard-basic" label="Search Reviews" variant="standard" 
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={(e) => searchReviews()} type="submit">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={handleTextSearchChange("keyword")}
      />
      </FormControl>
      <FormControl variant="standard" sx={{ m: 1, width: '30ch' }} >
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={searchObj.category}
                  label="Category"
                  onChange={handleTextSearchChange("category")}
                  >
              <MenuItem value={"subject"}>Subject</MenuItem>
              <MenuItem value={"description"}>Description</MenuItem>
              <MenuItem value={"starRating"}>Rating</MenuItem>
              <MenuItem value={"student"}>Student Username</MenuItem>
              </Select>
      </FormControl>
      </form>
  </div>
}