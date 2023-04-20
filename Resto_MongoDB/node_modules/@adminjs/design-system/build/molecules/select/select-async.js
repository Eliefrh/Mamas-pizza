function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import noop from 'lodash/noop.js';
import React, { lazy } from 'react';
import useSelectTheme from "./select-theme.js";
import { cssClass, filterStyles, selectStyles } from "../../utils/index.js";
const ReactAsyncSelect = /*#__PURE__*/lazy(() => import('react-select/async'));
const SelectAsyncComponent = ReactAsyncSelect.default || ReactAsyncSelect;
export const SelectAsync = props => {
  const {
    value,
    onChange,
    variant,
    ...selectProps
  } = props;
  const {
    theme,
    selectTheme
  } = useSelectTheme();
  const styles = variant === 'filter' ? filterStyles(theme) : selectStyles(theme);
  const handleChange = selected => {
    if (typeof onChange === 'function') onChange(selected);
  };
  return /*#__PURE__*/React.createElement(SelectAsyncComponent, _extends({
    className: cssClass('Select'),
    theme: selectTheme,
    value: value,
    styles: styles,
    onChange: handleChange,
    isClearable: true
  }, selectProps));
};
SelectAsync.defaultProps = {
  variant: 'default',
  onChange: noop
};
export default SelectAsync;