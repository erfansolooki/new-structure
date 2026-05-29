import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './swagger.json',
    },
    output: {
      target: './src/lib/api/endpoints1',
      client: 'react-query',
      mode: 'tags-split',
      schemas: './src/lib/api/models1',
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
