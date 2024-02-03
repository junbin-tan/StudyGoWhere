export const filterTransactions = (transactions, category, search) => {
    if (category && search) {
      if (category == "totalAmount" || category == "transactionId") {
        return transactions?.filter(a => String(a[category]).toLowerCase().includes(search.toLowerCase()));
      } 
      return transactions?.filter(a => a[category].toLowerCase().includes(search.toLowerCase()));
    } else {
      return transactions;
    } 
  }
  export const bgColor = (receiver, token) => {
    if (receiver === token.sub) {
      return "bg-green-600";
    } else {
      return "bg-red-600";
    }
  }

  export const conductBillableDTOMapping = (map, _t) => {
    const map2 = new Map();
    _t.billableDTOList.forEach(b => {
      if (!map.get(b.billableName)) {
        map2.set(b.billableName, b);
        map.set(b.billableName, 1);
      } else {
        map.set(b.billableName, map.get(b.billableName) + 1);
      }
    });
  
    _t.billableDTOList = Array.from(map2.keys()).map(billableName => (
      {billableName : billableName,
      billablePrice : (map2.get(billableName).billablePrice/100).toFixed(2), 
      id : billableName,
      quantity :  (map.get(billableName) ? map.get(billableName) : 0) ,
      subtotal : ((map.get(billableName) ? map.get(billableName) : 0) * (map2.get(billableName).billablePrice/100)).toFixed(2)
    }))
  
    return _t;
  }

      // _t.billableDTOList = _t.billableDTOList.map(b => (
    //   {...b, 
    //     billablePrice : (b.billablePrice/100).toFixed(2), 
    //     id : b.billableId,
    //     quantity :  (map.get(b.billableName) ? map.get(b.billableName) : 0) ,
    //     subtotal : ((map.get(b.billableName) ? map.get(b.billableName) : 0) * (b.billablePrice/100)).toFixed(2)
    //   }));