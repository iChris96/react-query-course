// eslint-disable-next-line simple-import-sort/imports
import { useMutation, useQueryClient } from 'react-query';
import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update return type
export function useCancelAppointment(): (appointment: Appointment) => void {
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (appointment: Appointment) => removeAppointmentUser(appointment),
    {
      onSuccess: () => {
        toast({ title: 'Appointment removed!', status: 'success' });
        queryClient.invalidateQueries([queryKeys.appointments, queryKeys.user]);
      },
    },
  );

  // TODO: replace with mutate function
  return mutate;
}
