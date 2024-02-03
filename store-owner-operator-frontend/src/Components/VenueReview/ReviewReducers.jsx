export const reviewReducer = (state, action) => {
    switch (action.type) {
      case 'EDIT_OPEN':
          return state.map(r => {
            if (r.reviewId === action.id) {
              return {...r, editMode : true};
            }
            return r;
          });
      case 'REPLY':
        return state.map(r => {
          if (r.reviewId === action.id) {
            return {...r, ownerReply : action.ownerReply, editMode : false};
          }
          return r;
        })
      case 'SET':
        return action.reviews;
      case 'EDIT_CLOSE':
        return state.map(r => {
          if (r.reviewId === action.id) {
            return {...r, editMode : false};
          }
          return r;
        });
      default:
        return state;
    }
  };