import jsonpatch from 'fast-json-patch';
import { useMutation, useQueryClient } from 'react-query';
import { queryKeys } from 'react-query/constants';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from './useUser';

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
}

// TODO: update type to UseMutateFunction type
export function usePatchUser(): (newData: User | null) => void {
  const { user, updateUser } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  const { mutate: patchUser } = useMutation(
    (newData: User) => patchUserOnServer(newData, user),
    {
      // onMutate return context that is passed to onError
      onMutate: async (response: User | null) => {
        // cancel any outgoing queries for user data. So old server data doesn't overwrite our optimistic update.
        queryClient.cancelQueries(queryKeys.user);
        // get previous user data from cache
        const previousUserData: User = queryClient.getQueryData(queryKeys.user);
        // optimistically update the cache with the new user value
        updateUser(response);
        // return context with the old user data.
        return { previousUserData };
      },
      onSuccess: (response: User | null) => {
        if (response) {
          // updateUser(response); we don't need udpate user here since we use onMutate to optimistically update the user
          toast({ title: 'User updated!', status: 'success' });
        }
      },
      onError: (error, newData, context) => {
        // roll back cache to saved value
        if (context.previousUserData) {
          updateUser(context.previousUserData); // restore old state
          toast({
            title: 'Update failed; restoring previous values..',
            status: 'warning',
          });
        }
      },
      onSettled: () => {
        // invalidate user query to make sure we're in sync with server data
        queryClient.invalidateQueries(queryKeys.user);
      },
    },
  );

  return patchUser;
}
