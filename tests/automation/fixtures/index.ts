import { test as base } from '@playwright/test';

type Fixtures = {
  // reserved for future shared fixtures (e.g., authenticatedPage)
};

export const test = base.extend<Fixtures>({});

export { expect } from '@playwright/test';
