import React from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

export default function SearchComponent({changeSearch, handleCategoryChange, entityName, categories}) {
    return (
      <div className='col-span-10'>
        <form>
          <FormControl variant="standard" sx={{ m: 1, width: '30ch' }}>
            <TextField 
              id="standard-basic" 
              label={"Search " + entityName}
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
              {categories.map(cat => {
                return <MenuItem key={cat.field} value={cat.field}>{cat.label}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </form>
      </div>
    );
}
