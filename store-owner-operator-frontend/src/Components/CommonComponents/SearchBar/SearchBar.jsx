import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {BiSearch} from "react-icons/bi";

const inputProps = {
    endAdornment: (
        <InputAdornment position={"end"}>
            <BiSearch />
        </InputAdornment>
    )
}
export default function SearchBar({name = "searchInput", value,
                                      placeholder = "Search...", onChange = (e) => console.log(e),
                                      InputProps = inputProps,
                                      ...rest}) {

    return (<TextField
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        InputProps={InputProps}
        {...rest}
    />)
}
