import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts';
import { GContextTypes } from '../../types';
import Login from './Login';
import Register from './Register';

export default function Auth() {
  const [reg, setReg] = useState(false);
  const {
    dispatch,
    store: { wrongTimes, startBlock },
    translate: { isRTL, words },
  }: GContextTypes = useContext(GlobalContext);
  return (
    <div>
      {!reg && (
        <Login
          setReg={setReg}
          isRTL={isRTL}
          dispatch={dispatch}
          wrongTimes={wrongTimes}
          startBlock={startBlock}
          words={words}
        ></Login>
      )}
      {reg && (
        <Register
          setReg={setReg}
          isRTL={isRTL}
          dispatch={dispatch}
          wrongTimes={wrongTimes}
          startBlock={startBlock}
          words={words}
        ></Register>
      )}
    </div>
  );
}
