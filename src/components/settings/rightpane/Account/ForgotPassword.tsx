import React from 'react';
import { css } from '@emotion/react';
import { AccountChildProps } from '../Account';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { NormalLabel } from '../../../common/Label';

// Firebase authentication has been removed
// This component is a stub to prevent import errors

const ForgotPassword: React.FC<AccountChildProps> = () => {
  const COLORS = useThemeColors();

  const containerStyle = css`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 20px;
  `;

  const messageStyle = css`
    text-align: center;
    color: ${COLORS.LABEL_L2_COLOR};
  `;

  return (
    <div css={containerStyle}>
      <div css={messageStyle}>
        <NormalLabel value="Firebase authentication has been removed." />
        <br />
        <NormalLabel value="All data is now stored locally only." />
      </div>
    </div>
  );
};

export default ForgotPassword;
