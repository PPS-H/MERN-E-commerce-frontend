import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../types/types";
import { MessageResponse, UserResponse } from "../../types/ApiTypes";
import axios from "axios";

export const userAPI = createApi({
  reducerPath: "userApi", //Reducer name used in store.ts
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_SERVER}/api/v1/user`,
  }), // Base url
  endpoints: (builder) => ({
    //mutation is for data manipulation
    login: builder.mutation<MessageResponse, User>({
      //MessageResponse is for response type and User is for getting data for body
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
    }), // Can add more endpoints also
  }),
});

export const { useLoginMutation } = userAPI; // useLoginMutation automatically generated according to endpoint name

export const getUser = async (id: string) => {
  try {
    const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_BACKEND_SERVER}/api/v1/user/${id}?id=fugsewdhaiq`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
