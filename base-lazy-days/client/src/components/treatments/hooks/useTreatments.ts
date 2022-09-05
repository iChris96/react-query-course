import { useQuery, useQueryClient } from 'react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  // TODO: get data from server via useQuery
  const { data = [] } = useQuery(queryKeys.treatments, getTreatments, {
    staleTime: 3000,
  });

  return data;
}

export function usePrefetchTreatments(): void {
  const queryClient = useQueryClient(); // we need to get our queryClient
  queryClient.prefetchQuery(queryKeys.treatments, getTreatments);
}
