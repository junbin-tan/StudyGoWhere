import React, {useState} from "react";
import Api from "../../Helpers/Api";
import { useNavigate } from "react-router-dom";  
import useEncodedToken from "../../Helpers/useEncodedToken";
import useToken from "../../Helpers/useToken";
import TransactionRefundDialog from "./TransactionRefundDialog";

const TransactionDropDownButton = ({ transaction, scope, refreshTransactions }) => {
  const { encodedToken } = useEncodedToken();
  const {token} = useToken();
  const handleEdit = () => {  
    navigate(`/transactions/${scope}/${transaction.id}`);
  }
  const navigate = useNavigate();  // Initialize the useNavigate hook

  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-row gap">
        <TransactionRefundDialog
            handleClose={() => setOpen(false)}
            open={open}
            refreshTransactions={refreshTransactions}
            transaction={transaction}>
        </TransactionRefundDialog>
      <div>          <button
            onClick={handleEdit}
            className="bg-blue-400 hover:bg-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-2 text-center mr-2" 
          >
            View Details
          </button>
          {transaction?.receiver === token.sub && scope ==="all" && transaction?.totalAmount > 0 && !transaction?.refunded && <button
            onClick={() => setOpen(true)}
            className="bg-blue-400 hover:bg-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-2 text-center mr-2" 
          >
            Refund Transaction
          </button>}
      </div>
    </div>
  );
};

export default TransactionDropDownButton;
