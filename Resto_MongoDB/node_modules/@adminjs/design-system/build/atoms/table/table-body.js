import { styled } from "../../../build/utils/styled.js";
import { cssClass } from "../../utils/css-class.js";

/**
 * @component
 * @private
 */
const TableBody = styled.tbody`

`;
TableBody.defaultProps = {
  className: cssClass('TableBody')
};
export default TableBody;