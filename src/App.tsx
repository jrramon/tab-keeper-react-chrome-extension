import { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { css } from '@emotion/react';

import { APP_WIDTH } from './utils/constants/common';
import MainContainer from './components/MainContainer';
import { AppDispatch } from './redux/store';
import { setPresentStartup } from './redux/slices/undoRedoSlice';
import { useThemeColors } from './hooks/useThemeColors';
import { replaceState } from './redux/slices/tabContainerDataStateSlice';
import { openRateAndReviewModal } from './redux/slices/globalStateSlice';

import './App.css';
import { setExtensionInstalledTime } from './redux/slices/settingsDataStateSlice';
import { isValidDate, loadFromLocalStorage } from './utils/functions/local';

function App() {
  const COLORS = useThemeColors();
  const dispatch: AppDispatch = useDispatch();

  // ask user to rate and review the extension
  function askUserToRateAndReview() {
    // load from localstorage to check if user has already rated and reviewed
    const {
      extensionInstalledTime = '',
      isUserRatedAndReviewed = false,
      isNeverAskAgainToRate = false,
      lastReviewRequestTime = '',
    } = loadFromLocalStorage('settingsData') || {};

    // if user has already rated and reviewed, then don't ask again
    if (isUserRatedAndReviewed || isNeverAskAgainToRate) {
      return;
    }

    // if user is first time user, then wait till he/she uses the extension for a day
    if (!isValidDate(extensionInstalledTime)) {
      dispatch(setExtensionInstalledTime());
      return;
    }
    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
    const currentTimeInMs = new Date().getTime();
    const extensionInstalledTimeInMs = new Date(
      extensionInstalledTime
    ).getTime();
    if (currentTimeInMs - extensionInstalledTimeInMs < ONE_DAY_IN_MS) {
      return;
    }

    // if user has already been asked to rate and review, then wait for 3 days to ask again
    if (isValidDate(lastReviewRequestTime)) {
      const lastReviewRequestTimeInMs = new Date(
        lastReviewRequestTime
      ).getTime();
      const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
      if (currentTimeInMs - lastReviewRequestTimeInMs < THREE_DAYS_IN_MS) {
        return;
      }
    }

    // It's to ask the user to rate and review!
    dispatch(openRateAndReviewModal());
  }

  useEffect(() => {
    askUserToRateAndReview();

    // Load from local storage only (no Firebase sync)
    const tabDataFromLocalStorage = loadFromLocalStorage('tabContainerData');
    if (tabDataFromLocalStorage) {
      dispatch(replaceState(tabDataFromLocalStorage));
      // reset presentState in the undoRedoState
      dispatch(
        setPresentStartup({
          tabContainerDataState: tabDataFromLocalStorage,
        })
      );
    }
  }, []);

  const containerStyle = css`
    background-color: ${COLORS.PRIMARY_COLOR};
    width: ${APP_WIDTH};
    position: relative;
  `;

  const buildTimeStyle = css`
    position: absolute;
    bottom: 2px;
    right: 5px;
    font-size: 9px;
    color: ${COLORS.TEXT_COLOR};
    opacity: 0.4;
    user-select: none;
    pointer-events: none;
    font-family: monospace;
  `;

  return (
    <div css={containerStyle}>
      <MainContainer />
      <div css={buildTimeStyle}>{__BUILD_TIME__}</div>
    </div>
  );
}

export default App;
