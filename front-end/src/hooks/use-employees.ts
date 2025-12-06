import { useQuery, useMutation } from '@apollo/client/react';
import {
  LIST_EMPLOYEES_QUERY,
  EMPLOYEES_PAGINATION_QUERY,
  EMPLOYEE_STATISTICS_QUERY,
  GET_EMPLOYEE_QUERY,
  CREATE_EMPLOYEE_MUTATION,
  UPDATE_EMPLOYEE_MUTATION,
  DELETE_EMPLOYEE_MUTATION,
  ListEmployeesVariables,
  EmployeesPaginationVariables,
  GetEmployeeVariables,
  CreateEmployeeVariables,
  UpdateEmployeeVariables,
  DeleteEmployeeVariables,
} from '@/graphql/employee.queries';
import { useToast } from '@/hooks/use-toast';

export function useEmployees(variables?: ListEmployeesVariables) {
  const { toast } = useToast();
  
  const { data, loading, error, refetch } = useQuery(LIST_EMPLOYEES_QUERY, {
    variables,
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch employees',
        variant: 'destructive',
      });
    },
  });

  // Get pagination info
  const paginationVariables: EmployeesPaginationVariables = {
    filter: variables?.filter,
    page: variables?.page,
    limit: variables?.limit,
  };

  const { data: paginationData } = useQuery(EMPLOYEES_PAGINATION_QUERY, {
    variables: paginationVariables,
    fetchPolicy: 'cache-and-network',
    skip: loading, // Skip if main query is loading
  });

  const employees = data?.employees || [];
  const pagination = paginationData?.employeesPagination;

  return {
    employees,
    loading,
    error,
    refetch,
    totalPages: pagination?.totalPages || 1,
    totalCount: pagination?.totalCount || 0,
  };
}

export function useEmployee(id: string) {
  const { toast } = useToast();
  
  const { data, loading, error, refetch } = useQuery(GET_EMPLOYEE_QUERY, {
    variables: { id },
    skip: !id,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch employee',
        variant: 'destructive',
      });
    },
  });

  return {
    employee: data?.employee,
    loading,
    error,
    refetch,
  };
}

export function useCreateEmployee() {
  const { toast } = useToast();
  
  const [createEmployee, { loading }] = useMutation(CREATE_EMPLOYEE_MUTATION, {
    refetchQueries: [{ query: LIST_EMPLOYEES_QUERY }, { query: EMPLOYEE_STATISTICS_QUERY }],
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Employee created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create employee',
        variant: 'destructive',
      });
    },
  });

  return {
    createEmployee: (variables: CreateEmployeeVariables) => createEmployee({ variables }),
    loading,
  };
}

export function useUpdateEmployee() {
  const { toast } = useToast();
  
  const [updateEmployee, { loading }] = useMutation(UPDATE_EMPLOYEE_MUTATION, {
    refetchQueries: [{ query: LIST_EMPLOYEES_QUERY }, { query: EMPLOYEE_STATISTICS_QUERY }],
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Employee updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update employee',
        variant: 'destructive',
      });
    },
  });

  return {
    updateEmployee: (variables: UpdateEmployeeVariables) => updateEmployee({ variables }),
    loading,
  };
}

export function useDeleteEmployee() {
  const { toast } = useToast();
  
  const [deleteEmployee, { loading }] = useMutation(DELETE_EMPLOYEE_MUTATION, {
    refetchQueries: [{ query: LIST_EMPLOYEES_QUERY }, { query: EMPLOYEE_STATISTICS_QUERY }],
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete employee',
        variant: 'destructive',
      });
    },
  });

  return {
    deleteEmployee: (variables: DeleteEmployeeVariables) => deleteEmployee({ variables }),
    loading,
  };
}

export function useEmployeeStatistics() {
  const { toast } = useToast();
  
  const { data, loading, error, refetch } = useQuery(EMPLOYEE_STATISTICS_QUERY, {
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch employee statistics',
        variant: 'destructive',
      });
    },
  });

  return {
    statistics: data?.employeeStatistics,
    loading,
    error,
    refetch,
  };
}

