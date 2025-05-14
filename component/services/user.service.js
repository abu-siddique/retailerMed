import apiSlice from "./api";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // OTP Endpoints
    sendOtp: builder.mutation({
      query: (phoneNumber) => ({
        url: "/api/auth/otp/send",
        method: "POST",
        body: { phone: phoneNumber },
      }),
    }),

    verifyOtp: builder.mutation({
      query: ({ phone, otp }) => ({
        url: "/api/auth/otp/verify",
        method: "POST",
        body: { phone, otp },
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    // User Profile Endpoints
    getUserInfo: builder.query({
      query: () => "/api/user/me",
      providesTags: [{ type: "User", id: "CURRENT" }],
    }),

    submitVerification: builder.mutation({
      query: (verificationData) => ({
        url: "/api/user/verify",
        method: "POST",
        body: verificationData,
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    updateProfile: builder.mutation({
      query: (updates) => ({
        url: "/api/user/update",
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    // Admin Endpoints
    getPendingVerifications: builder.query({
      query: () => "/api/admin/pending-verifications",
      providesTags: ["Verifications"],
    }),

    updateApprovalStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/api/admin/approve/${userId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Verifications", { type: "User", id: "CURRENT" }],
    }),

    // User management (admin)
    getUsers: builder.query({
      query: ({ page = 1 } = {}) => `/api/user?page=${page}`,
      providesTags: (result) =>
        result?.data?.users
          ? [
              // tag each user
              ...result.data.users.map(({ _id }) => ({
                type: "User",
                id: _id,
              })),
              // tag the list container
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation({
      query: ({ _id, ...updates }) => ({
        url: "/api/user",
        method: "PATCH",
        body: { _id, ...updates },
      }),
      // Invalidate this specific user and the list
      invalidatesTags: (result, error, { _id }) => [
        { type: "User", id: _id },
        { type: "User", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/user/${id}`,
        method: "DELETE",
      }),
      // Invalidate the user and the list
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

// Export hooks and tagTypes if needed
export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetUserInfoQuery,
  useSubmitVerificationMutation,
  useUpdateProfileMutation,
  useGetPendingVerificationsQuery,
  useUpdateApprovalStatusMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
