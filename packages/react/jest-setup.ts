import '@testing-library/jest-dom';
import { matchers } from '@emotion/jest';

expect.extend(matchers);

Element.prototype.scrollTo = jest.fn();
