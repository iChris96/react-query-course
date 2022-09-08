import { act, renderHook } from '@testing-library/react-hooks';

import { createQueryClientWrapper } from '../../../test-utils';
import { useAppointments } from '../hooks/useAppointments';
import { AppointmentDateMap } from '../types';

// a helper function to get the total number of appointments from an AppointmentDateMap object
const getAppointmentCount = (appointments: AppointmentDateMap) =>
  Object.values(appointments).reduce(
    (runningCount, appointmentsOnDate) =>
      runningCount + appointmentsOnDate.length,
    0,
  );

test('filter appointments by availability', async () => {
  // test goes here
  const { result, waitFor } = renderHook(useAppointments, {
    wrapper: createQueryClientWrapper(),
  });

  /* useAppoitments returns >>
    
  Interface UseAppointments {
    appointments: AppointmentDateMap;
    monthYear: MonthYear;
    updateMonthYear: (monthIncrement: number) => void;
    showAll: boolean; // default false -> shows only available appointments
    setShowAll: Dispatch<SetStateAction<boolean>>;
  }

  */

  // wait for the appointments to populate
  await waitFor(() => Object.keys(result.current.appointments).length > 0);

  const filteredAppointmentLength = getAppointmentCount(
    result.current.appointments,
  );

  // set show all appointments to show all the appointments and not only availables
  act(() => result.current.setShowAll(true));

  // wait for the appointments to show more than when filtered
  await waitFor(() => {
    return (
      getAppointmentCount(result.current.appointments) > // we should have more appointments now
      filteredAppointmentLength
    );
  });
});
