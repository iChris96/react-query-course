import { act, renderHook } from '@testing-library/react-hooks';
import { createQueryClientWrapper } from 'test-utils';

import { useStaff } from '../hooks/useStaff';

test('filter staff', async () => {
  // the magic happens here
  const { result, waitFor } = renderHook(useStaff, {
    wrapper: createQueryClientWrapper(),
  });

  // wait for the staff to be 4
  await waitFor(() => Object.keys(result.current.staff).length === 4); // Dyvyam Sandra, Michael & Mateo

  // update the filter state value
  act(() => result.current.setFilter('scrub'));

  // expect the staff length to be appropriate for the new filter state
  await waitFor(() => {
    return (
      Object.keys(result.current.staff).length === 2 // we should have only Divya & Michael now
    );
  });
});
