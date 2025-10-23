/* eslint-disable @typescript-eslint/no-unused-vars */
// ================================================================================================================
// ORVAL GENERATED API USAGE EXAMPLES
// ================================================================================================================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ================================================================================================================
// 1. SETUP REACT QUERY PROVIDER (in your main.tsx or App.tsx)
// ================================================================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>{/* Your app components */}</QueryClientProvider>
  );
}

// ================================================================================================================
// 2. USING QUERY HOOKS (GET requests)
// ================================================================================================================

// Example: Using medicine endpoints
import {
  useGetApiV1PublicMedicine,
  useGetApiV1PublicMedicineById,
} from './endpoints/medicine/medicine';

function MedicineList() {
  // GET list of medicines with parameters
  const { data, isLoading, error, refetch } = useGetApiV1PublicMedicine({
    page: 1,
    limit: 10,
    search: 'aspirin',
  });

  if (isLoading) return <div>Loading medicines...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Medicines</h1>
      <button onClick={() => refetch()}>Refresh</button>
      {data?.data?.map((medicine: any) => (
        <div key={medicine.id}>{medicine.name}</div>
      ))}
    </div>
  );
}

// Example: Get single medicine by ID
function MedicineDetail({ medicineId }: { medicineId: string }) {
  const { data, isLoading } = useGetApiV1PublicMedicineById(medicineId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{data?.name}</h2>
      <p>{data?.description}</p>
    </div>
  );
}

// ================================================================================================================
// 3. USING MUTATION HOOKS (POST, PUT, DELETE requests)
// ================================================================================================================

import {
  usePostApiV1PublicMedicine,
  usePutApiV1PublicMedicineById,
  useDeleteApiV1PublicMedicineById,
} from './endpoints/medicine/medicine';

function MedicineManager() {
  // POST - Create medicine
  const createMedicine = usePostApiV1PublicMedicine();

  // PUT - Update medicine
  const updateMedicine = usePutApiV1PublicMedicineById();

  // DELETE - Delete medicine
  const deleteMedicine = useDeleteApiV1PublicMedicineById();

  const handleCreate = async () => {
    try {
      const result = await createMedicine.mutateAsync({
        data: {
          name: 'New Medicine',
          description: 'Description here',
          price: 100,
        },
      });
      console.log('Created:', result);
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateMedicine.mutateAsync({
        id,
        data: {
          name: 'Updated Name',
        },
      });
      console.log('Updated successfully');
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedicine.mutateAsync({ id });
      console.log('Deleted successfully');
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={createMedicine.isPending}>
        {createMedicine.isPending ? 'Creating...' : 'Create Medicine'}
      </button>

      {createMedicine.isError && <div>Error: {createMedicine.error.message}</div>}

      {createMedicine.isSuccess && <div>Successfully created!</div>}
    </div>
  );
}

// ================================================================================================================
// 4. WITH LOADING AND ERROR STATES
// ================================================================================================================

import { useGetApiV1PublicInvoice } from './endpoints/invoice/invoice';

function InvoiceList() {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetApiV1PublicInvoice();

  return (
    <div>
      {isLoading && <div>Loading invoices...</div>}

      {isFetching && !isLoading && <div>Updating...</div>}

      {isError && (
        <div className="error">
          <p>Error: {error?.message}</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {data && (
        <div>
          <h2>Invoices ({data.total})</h2>
          {data.items?.map((invoice: any) => (
            <div key={invoice.id}>{invoice.number}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ================================================================================================================
// 5. WITH REACT QUERY OPTIONS
// ================================================================================================================

import { useGetApiV1PublicDashboard } from './endpoints/dashboard/dashboard';

function Dashboard() {
  const { data } = useGetApiV1PublicDashboard(
    {},
    {
      // React Query options
      refetchInterval: 30000, // Refetch every 30 seconds
      enabled: true, // Enable/disable query
      onSuccess: (data) => {
        console.log('Dashboard loaded:', data);
      },
      onError: (error) => {
        console.error('Dashboard error:', error);
      },
    }
  );

  return <div>{/* Dashboard content */}</div>;
}

// ================================================================================================================
// 6. OPTIMISTIC UPDATES
// ================================================================================================================

import { useQueryClient } from '@tanstack/react-query';
import { usePutApiV1PublicInvoiceById } from './endpoints/invoice/invoice';

function InvoiceItem({ invoice }: { invoice: any }) {
  const queryClient = useQueryClient();
  const updateInvoice = usePutApiV1PublicInvoiceById();

  const handleUpdate = async () => {
    await updateInvoice.mutateAsync(
      {
        id: invoice.id,
        data: { status: 'paid' },
      },
      {
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({
            queryKey: ['getApiV1PublicInvoice'],
          });
        },
      }
    );
  };

  return (
    <div>
      <span>{invoice.number}</span>
      <button onClick={handleUpdate}>Mark as Paid</button>
    </div>
  );
}

// ================================================================================================================
// 7. CONDITIONAL QUERIES
// ================================================================================================================

function ConditionalQuery({ userId }: { userId: string | null }) {
  const { data } = useGetApiV1PublicInvoice(
    { userId: userId || '' },
    {
      enabled: !!userId, // Only run query if userId exists
    }
  );

  return <div>{/* Content */}</div>;
}

// ================================================================================================================
// 8. PARALLEL QUERIES
// ================================================================================================================

import { useGetApiV1PublicMedicine } from './endpoints/medicine/medicine';
import { useGetApiV1PublicInvoice } from './endpoints/invoice/invoice';
import { useGetApiV1PublicDashboard } from './endpoints/dashboard/dashboard';

function MultipleQueries() {
  const medicines = useGetApiV1PublicMedicine();
  const invoices = useGetApiV1PublicInvoice();
  const dashboard = useGetApiV1PublicDashboard();

  const isLoading = medicines.isLoading || invoices.isLoading || dashboard.isLoading;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div>Medicines: {medicines.data?.length}</div>
      <div>Invoices: {invoices.data?.length}</div>
      <div>Dashboard: {dashboard.data?.totalRevenue}</div>
    </div>
  );
}

// ================================================================================================================
// 9. DEPENDENT QUERIES
// ================================================================================================================

function DependentQueries({ medicineId }: { medicineId: string }) {
  // First query
  const medicine = useGetApiV1PublicMedicineById(medicineId);

  // Second query depends on first
  const relatedData = useGetApiV1PublicMedicine(
    { category: medicine.data?.category },
    {
      enabled: !!medicine.data, // Only run when first query succeeds
    }
  );

  return <div>{/* Content */}</div>;
}

// ================================================================================================================
// 10. PAGINATION
// ================================================================================================================

import { useState } from 'react';

function PaginatedList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useGetApiV1PublicMedicine({
    page,
    limit: pageSize,
  });

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>
            {data?.data?.map((item: any) => (
              <div key={item.id}>{item.name}</div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>

            <span>Page {page}</span>

            <button onClick={() => setPage(page + 1)} disabled={!data?.hasMore}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ================================================================================================================
// SUMMARY
// ================================================================================================================

/*
1. ✅ All endpoints are automatically typed
2. ✅ React Query hooks for easy data fetching
3. ✅ Automatic caching and background refetching
4. ✅ Loading, error, and success states built-in
5. ✅ Mutations with optimistic updates
6. ✅ TypeScript auto-complete support

To regenerate after Swagger changes:
  yarn orval

Available endpoints in: ./endpoints/
Available types in: ./models/
*/
