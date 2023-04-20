import React from 'react';
import { Box, Button, H2, H5, Illustration, Text } from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';
import { useTranslation } from '../../hooks/index.js';
const pageHeaderHeight = 284;
const pageHeaderPaddingY = 74;
const pageHeaderPaddingX = 250;
export const DashboardHeader = () => {
  const {
    translateMessage
  } = useTranslation();
  return /*#__PURE__*/React.createElement(Box, {
    position: "relative",
    overflow: "hidden",
    "data-css": "default-dashboard"
  }, /*#__PURE__*/React.createElement(Box, {
    position: "absolute",
    top: 50,
    left: -10,
    opacity: [0.2, 0.4, 1],
    animate: true
  }, /*#__PURE__*/React.createElement(Illustration, {
    variant: "Rocket"
  })), /*#__PURE__*/React.createElement(Box, {
    position: "absolute",
    top: -70,
    right: -15,
    opacity: [0.2, 0.4, 1],
    animate: true
  }, /*#__PURE__*/React.createElement(Illustration, {
    variant: "Moon"
  })), /*#__PURE__*/React.createElement(Box, {
    bg: "grey100",
    height: pageHeaderHeight,
    py: pageHeaderPaddingY,
    px: ['default', 'lg', pageHeaderPaddingX]
  }, /*#__PURE__*/React.createElement(Text, {
    textAlign: "center",
    color: "white"
  }, /*#__PURE__*/React.createElement(H2, null, translateMessage('welcomeOnBoard_title')), /*#__PURE__*/React.createElement(Text, {
    opacity: 0.8
  }, translateMessage('welcomeOnBoard_subtitle')))));
};
const boxes = ({
  translateMessage
}) => [{
  variant: 'Planet',
  title: translateMessage('addingResources_title'),
  subtitle: translateMessage('addingResources_subtitle'),
  href: 'https://adminjs.co/tutorial-passing-resources.html'
}, {
  variant: 'DocumentCheck',
  title: translateMessage('customizeResources_title'),
  subtitle: translateMessage('customizeResources_subtitle'),
  href: 'https://adminjs.co/tutorial-customizing-resources.html'
}, {
  variant: 'DocumentSearch',
  title: translateMessage('customizeActions_title'),
  subtitle: translateMessage('customizeActions_subtitle'),
  href: 'https://adminjs.co/tutorial-actions.html'
}, {
  variant: 'FlagInCog',
  title: translateMessage('writeOwnComponents_title'),
  subtitle: translateMessage('writeOwnComponents_subtitle'),
  href: 'https://adminjs.co/tutorial-writing-react-components.html'
}, {
  variant: 'Folders',
  title: translateMessage('customDashboard_title'),
  subtitle: translateMessage('customDashboard_subtitle'),
  href: 'https://adminjs.co/tutorial-custom-dashboard.html'
}, {
  variant: 'Astronaut',
  title: translateMessage('roleBasedAccess_title'),
  subtitle: translateMessage('roleBasedAccess_subtitle'),
  href: 'https://adminjs.co/tutorial-rbac.html'
}];
const Card = styled(Box)`
  display: ${({
  flex
}) => flex ? 'flex' : 'block'};
  color: ${({
  theme
}) => theme.colors.grey100};
  height: 100%;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: ${({
  theme
}) => theme.space.md};
  transition: all 0.1s ease-in;
  &:hover {
    border: 1px solid ${({
  theme
}) => theme.colors.primary100};
    box-shadow: ${({
  theme
}) => theme.shadows.cardHover};
  }
`;
Card.defaultProps = {
  variant: 'container',
  boxShadow: 'card'
};
export const Dashboard = () => {
  const {
    translateMessage,
    translateButton
  } = useTranslation();
  return /*#__PURE__*/React.createElement(Box, null, /*#__PURE__*/React.createElement(DashboardHeader, null), /*#__PURE__*/React.createElement(Box, {
    mt: ['xl', 'xl', '-100px'],
    mb: "xl",
    mx: [0, 0, 0, 'auto'],
    px: ['default', 'lg', 'xxl', '0'],
    position: "relative",
    flex: true,
    flexDirection: "row",
    flexWrap: "wrap",
    width: [1, 1, 1, 1024]
  }, boxes({
    translateMessage
  }).map((box, index) =>
  /*#__PURE__*/
  // eslint-disable-next-line react/no-array-index-key
  React.createElement(Box, {
    key: index,
    width: [1, 1 / 2, 1 / 2, 1 / 3],
    p: "lg"
  }, /*#__PURE__*/React.createElement(Card, {
    as: "a",
    href: box.href,
    target: "_blank"
  }, /*#__PURE__*/React.createElement(Text, {
    textAlign: "center"
  }, /*#__PURE__*/React.createElement(Illustration, {
    variant: box.variant,
    width: 100,
    height: 70
  }), /*#__PURE__*/React.createElement(H5, {
    mt: "lg"
  }, box.title), /*#__PURE__*/React.createElement(Text, null, box.subtitle))))), /*#__PURE__*/React.createElement(Box, {
    width: [1, 1, 1 / 2],
    p: "lg"
  }, /*#__PURE__*/React.createElement(Card, {
    as: "a",
    flex: true,
    href: "https://adminjs.page.link/slack",
    target: "_blank"
  }, /*#__PURE__*/React.createElement(Box, {
    flexShrink: 0
  }, /*#__PURE__*/React.createElement(Illustration, {
    variant: "SlackLogo"
  })), /*#__PURE__*/React.createElement(Box, {
    ml: "xl"
  }, /*#__PURE__*/React.createElement(H5, null, translateMessage('community_title')), /*#__PURE__*/React.createElement(Text, null, translateMessage('community_subtitle'))))), /*#__PURE__*/React.createElement(Box, {
    width: [1, 1, 1 / 2],
    p: "lg"
  }, /*#__PURE__*/React.createElement(Card, {
    as: "a",
    flex: true,
    href: "https://github.com/SoftwareBrothers/adminjs/issues",
    target: "_blank"
  }, /*#__PURE__*/React.createElement(Box, {
    flexShrink: 0
  }, /*#__PURE__*/React.createElement(Illustration, {
    variant: "GithubLogo"
  })), /*#__PURE__*/React.createElement(Box, {
    ml: "xl"
  }, /*#__PURE__*/React.createElement(H5, null, translateMessage('foundBug_title')), /*#__PURE__*/React.createElement(Text, null, translateMessage('foundBug_subtitle'))))), /*#__PURE__*/React.createElement(Card, {
    width: 1,
    m: "lg"
  }, /*#__PURE__*/React.createElement(Text, {
    textAlign: "center"
  }, /*#__PURE__*/React.createElement(Illustration, {
    variant: "AdminJSLogo"
  }), /*#__PURE__*/React.createElement(H5, null, translateMessage('needMoreSolutions_title')), /*#__PURE__*/React.createElement(Text, null, translateMessage('needMoreSolutions_subtitle')), /*#__PURE__*/React.createElement(Text, {
    mt: "xxl"
  }, /*#__PURE__*/React.createElement(Button, {
    as: "a",
    variant: "contained",
    href: "https://share.hsforms.com/1IedvmEz6RH2orhcL6g2UHA8oc5a",
    target: "_blank"
  }, translateButton('contactUs')))))));
};
export default Dashboard;