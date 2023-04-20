import type { Props } from 'react-select';
import type { DefaultTheme } from '@styled-components';
declare const selectStyles: (theme: DefaultTheme) => Props['styles'];
declare const filterStyles: (theme: DefaultTheme) => Props['styles'];
export { filterStyles, selectStyles };
