import { useQuery, useMutation } from '@apollo/client/react';
import {
  LIST_ATTENDANCE_QUERY,
  ATTENDANCE_PAGINATION_QUERY,
  ATTENDANCE_STATISTICS_QUERY,
  GET_ATTENDANCE_QUERY,
  MARK_ATTENDANCE_MUTATION,
  UPDATE_ATTENDANCE_MUTATION,
  DELETE_ATTENDANCE_MUTATION,
  ListAttendanceVariables,
  AttendancePaginationVariables,
  GetAttendanceVariables,
  MarkAttendanceVariables,
  UpdateAttendanceVariables,
  DeleteAttendanceVariables,
} from '@/graphql/attendance.queries';
import { useToast } from '@/hooks/use-toast';

export function useAttendance(variables?: ListAttendanceVariables) {
  const { toast } = useToast();
  
  const { data, loading, error, refetch } = useQuery(LIST_ATTENDANCE_QUERY, {
    variables,
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch attendance records',
        variant: 'destructive',
      });
    },
  });

  // Get pagination info
  const paginationVariables: AttendancePaginationVariables = {
    filter: variables?.filter,
    page: variables?.page,
    limit: variables?.limit,
  };

  const { data: paginationData } = useQuery(ATTENDANCE_PAGINATION_QUERY, {
    variables: paginationVariables,
    fetchPolicy: 'cache-and-network',
    skip: loading, // Skip if main query is loading
  });

  const attendance = data?.attendance || [];
  const pagination = paginationData?.attendancePagination;

  return {
    attendance,
    loading,
    error,
    refetch,
    totalPages: pagination?.totalPages || 1,
    totalCount: pagination?.totalCount || 0,
  };
}

export function useAttendanceById(id: string) {
  const { toast } = useToast();
  
  const { data, loading, error, refetch } = useQuery(GET_ATTENDANCE_QUERY, {
    variables: { id },
    skip: !id,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch attendance record',
        variant: 'destructive',
      });
    },
  });

  return {
    attendance: data?.attendanceById,
    loading,
    error,
    refetch,
  };
}

export function useMarkAttendance() {
  const { toast } = useToast();
  
  const [markAttendance, { loading }] = useMutation(MARK_ATTENDANCE_MUTATION, {
    refetchQueries: [{ query: LIST_ATTENDANCE_QUERY }, { query: ATTENDANCE_STATISTICS_QUERY }],
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Attendance marked successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to mark attendance',
        variant: 'destructive',
      });
    },
  });

  return {
    markAttendance: (variables: MarkAttendanceVariables) => markAttendance({ variables }),
    loading,
  };
}

export function useUpdateAttendance() {
  const { toast } = useToast();
  
  const [updateAttendance, { loading }] = useMutation(UPDATE_ATTENDANCE_MUTATION, {
    refetchQueries: [{ query: LIST_ATTENDANCE_QUERY }, { query: ATTENDANCE_STATISTICS_QUERY }],
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Attendance updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update attendance',
        variant: 'destructive',
      });
    },
  });

  return {
    updateAttendance: (variables: UpdateAttendanceVariables) => updateAttendance({ variables }),
    loading,
  };
}

export function useDeleteAttendance() {
  const { toast } = useToast();
  
  const [deleteAttendance, { loading }] = useMutation(DELETE_ATTENDANCE_MUTATION, {
    refetchQueries: [{ query: LIST_ATTENDANCE_QUERY }, { query: ATTENDANCE_STATISTICS_QUERY }],
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Attendance deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete attendance',
        variant: 'destructive',
      });
    },
  });

  return {
    deleteAttendance: (variables: DeleteAttendanceVariables) => deleteAttendance({ variables }),
    loading,
  };
}

export function useAttendanceStatistics() {
  const { toast } = useToast();
  
  const { data, loading, error, refetch } = useQuery(ATTENDANCE_STATISTICS_QUERY, {
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch attendance statistics',
        variant: 'destructive',
      });
    },
  });

  return {
    statistics: data?.attendanceStatistics,
    loading,
    error,
    refetch,
  };
}

