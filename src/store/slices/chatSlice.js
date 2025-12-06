import{createSlice, createAsyncThunk}from'@reduxjs/toolkit';
import {sendMessageToAi} from'../../models/aiModel';

export const askLumen = createAsyncThunk(
'chat/askLumen',
async({question, age, context}, {rejectWithValue})=>{

try{
const response = await sendMessageToAi(question, age, context);
return response;
}catch(error){

return rejectWithValue("Lumen is sleepy right now. Please try again later.");
}

}

);


const chatSlice = createSlice({
name:'chat',
initialState:{
    messages:[],
    isloading:false,
    error: null
},
reducers:{
addUserMessage:(state, action)=>{
state.messages.push({
role:'user',
text:action.payload,
timestamp:new Date().toISOString()
});
},

clearChat: (state) => {
state.messages = [];
}
},

extraReducers: (builder) => {
    builder
      
      .addCase(askLumen.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      
     
      .addCase(askLumen.fulfilled, (state, action) => {
        state.isLoading = false;
      
        state.messages.push(action.payload);
      })
      
     
      .addCase(askLumen.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
      });
  }
});

export const {addUserMessage, clearChat} = chatSlice.actions;
export default chatSlice.reducer;