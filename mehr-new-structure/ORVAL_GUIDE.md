# 🚀 Orval API Generation Guide

## What is Orval?

Orval is a tool that generates TypeScript API clients from your OpenAPI/Swagger specifications. It creates type-safe React Query hooks automatically.

## Prerequisites

Make sure you have:

- ✅ `swagger.json` file in your project root
- ✅ `orval` package installed
- ✅ `@tanstack/react-query` installed

## Generate API

### Simple Command

```bash
yarn orval
```

### What Gets Generated?

Orval will create:

```
src/lib/api/
├── endpoints/          # API endpoint hooks (split by tags)
│   ├── users.ts       # User-related hooks
│   ├── posts.ts       # Post-related hooks
│   └── ...
└── models/            # TypeScript types/interfaces
    ├── userModel.ts
    ├── postModel.ts
    └── ...
```

## Configuration

Your `orval.config.js` is configured with:

- **Input**: `./swagger.json` - Your OpenAPI spec
- **Output**: `./src/lib/api/endpoints` - Generated hooks
- **Client**: `react-query` - Uses React Query
- **Mode**: `tags-split` - Splits by Swagger tags
- **Mutator**: Custom API instance for HTTP calls
- **Clean**: `true` - Cleans old files before generation

## Using Generated APIs

### 1. Setup React Query (if not already done)

```tsx
// main.tsx or App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

### 2. Use Generated Hooks

```tsx
import { useGetUsers, useCreateUser } from '@/lib/api/endpoints/users';

function UsersPage() {
  // GET request
  const { data, isLoading, error } = useGetUsers();

  // POST request
  const createUserMutation = useCreateUser();

  const handleCreate = async () => {
    try {
      await createUserMutation.mutateAsync({
        name: 'John Doe',
        email: 'john@example.com',
      });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Users</h1>
      <button onClick={handleCreate}>Create User</button>
      {data?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 3. Query Parameters Example

```tsx
import { useGetUsers } from '@/lib/api/endpoints/users';

function UsersPage() {
  const { data } = useGetUsers({
    page: 1,
    limit: 10,
    status: 'active',
  });

  return <div>{/* ... */}</div>;
}
```

### 4. Mutation Example

```tsx
import { useUpdateUser, useDeleteUser } from '@/lib/api/endpoints/users';

function UserProfile() {
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleUpdate = async (userId: string) => {
    await updateUser.mutateAsync({
      id: userId,
      data: { name: 'New Name' },
    });
  };

  const handleDelete = async (userId: string) => {
    await deleteUser.mutateAsync({ id: userId });
  };

  return <div>{/* ... */}</div>;
}
```

### 5. Infinite Query Example

```tsx
import { useGetUsersInfinite } from '@/lib/api/endpoints/users';

function InfiniteUsersList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetUsersInfinite({
    limit: 20,
  });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.data.map((user) => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      ))}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load More
        </button>
      )}
    </div>
  );
}
```

## Workflow

### 1. Initial Setup

```bash
# Install dependencies
yarn add orval @tanstack/react-query

# Generate API
yarn orval
```

### 2. After Swagger Changes

```bash
# Update swagger.json file
# Then regenerate
yarn orval
```

### 3. Development Workflow

1. Backend updates API
2. Update `swagger.json`
3. Run `yarn orval`
4. Use new hooks in your components

## Custom API Instance

Your API calls go through `src/lib/swaggerConfig/apiInstance.ts` which:

- ✅ Adds authentication tokens
- ✅ Handles errors
- ✅ Supports both Axios and Fetch
- ✅ Manages base URL

## Tips

### 1. Auto-complete

Generated hooks have full TypeScript support with auto-complete!

### 2. Type Safety

All request/response types are automatically generated.

### 3. React Query Benefits

- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication

### 4. Regeneration

Run `yarn orval` whenever your Swagger spec changes.

### 5. Clean Generation

The `clean: true` option removes old files, keeping your codebase clean.

## Common Issues

### Issue: "require is not defined"

**Solution**: Config is now using ES modules ✅

### Issue: Generated files have errors

**Solution**:

1. Check your `swagger.json` is valid
2. Verify mutator path is correct
3. Run `yarn orval` again

### Issue: Can't find generated hooks

**Solution**: Make sure paths in `orval.config.js` match your project structure

## Advanced Configuration

### Custom Headers

Edit `src/lib/swaggerConfig/apiInstance.ts`:

```typescript
httpClient.setHeaders({
  ...headers,
  Authorization: `Bearer ${getToken()}`,
  'Custom-Header': 'value',
});
```

### Different Base URL

Update in `apiInstance.ts`:

```typescript
const _baseURL = 'https://your-api.com';
```

### Multiple Swagger Files

Add multiple configs in `orval.config.js`:

```javascript
export default defineConfig({
  api: {
    /* config 1 */
  },
  adminApi: {
    /* config 2 */
  },
});
```

## Package.json Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "api:generate": "orval",
    "api:watch": "orval --watch"
  }
}
```

Then use:

```bash
yarn api:generate       # Generate once
yarn api:watch          # Watch for changes
```

## Summary

1. **Generate**: `yarn orval`
2. **Import**: Generated hooks from `@/lib/api/endpoints`
3. **Use**: Type-safe hooks with React Query
4. **Regenerate**: When Swagger changes

Happy coding! 🎉
