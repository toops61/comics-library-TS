import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { RootState } from "./redux/store";
import { Route, Routes, useLocation } from "react-router-dom";
import captainShield from './assets/Captain_America_shield_mini.webp';
import Home from "./components/Home";
import ComicsPage from "./components/ComicsPage";
import Connect from "./components/Connect";
import CreateModify from "./components/CreateModify";
import { useStartFuncs } from "./utils/hooksFunctions";
import { useEffect } from "react";
import { checkConnection } from "./utils/fetchFuncs";
import { updateGeneralParams } from "./redux/generalParamsSlice";

export default function App() {
  const generalParams = useAppSelector((state : RootState) => state.generalParamsSlice);

  const showAlert = useStartFuncs();

  const location = useLocation();

  const dispatch = useAppDispatch();

  const isConnectedFunc = async () => {
    
    const result = await checkConnection();
    
    if (result.success) {
      dispatch(updateGeneralParams({connected:true}));
    }
  }

  useEffect(() => {
    isConnectedFunc();
  }, [])
  

  return (
    <div className={"App" + (location.pathname === '/comics' ? ' max' : '')}>
      {generalParams.isLoading ? <div className="loader">
        <div className="shield-container">
          <img src={captainShield} alt="captain shield" />
        </div>
      </div> : null}
      {generalParams.alertVisible ? <div className="alert-window">
        <div className="alert-message-container">
          <div className={generalParams.alertType}></div>
          <p>{generalParams.alertMessage}</p>
        </div>
      </div> : <></>}
      <Routes>
        <Route path="/" element={<Home showAlert={showAlert}/>} />
        <Route path="/connect" element={<Connect showAlert={showAlert}/>} />
        <Route path="/comics" element={<ComicsPage />} />
        <Route path="/createComic" element={<CreateModify showAlert={showAlert}/>} />
      </Routes>
    </div>
  )
}