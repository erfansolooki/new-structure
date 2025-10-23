import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './swagger.json',
    },
    output: {
      target: './src/lib/api/endpoints',
      client: 'react-query',
      mode: 'tags-split',
      schemas: './src/lib/api/models',
      mock: false,
      clean: true,
      prettier: true,
      override: {
        query: {
          useQuery: true,
          useInfinite: false,
        },
        mutator: {
          path: './src/lib/swaggerConfig/apiInstance.ts',
          name: 'apiInstance',
        },
      },
    },
  },
});
