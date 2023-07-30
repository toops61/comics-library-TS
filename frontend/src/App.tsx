import { useEffect } from "react";
import { updateGeneralParams } from "./redux/generalParamsSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { RootState } from "./redux/store";
import { Route, Routes, useLocation } from "react-router-dom";
import captainShield from './assets/Captain_America_shield_mini.webp';
import Home from "./components/Home";
import ComicsPage from "./components/ComicsPage";
import Connect from "./components/Connect";
import CreateModify from "./components/CreateModify";

export default function App() {
  const generalParams = useAppSelector((state : RootState) => state.generalParamsSlice);

  const dispatch = useAppDispatch();

  const showAlert = (message:string,type:string) => {
    const alertType = type ? type : '';
    dispatch(updateGeneralParams({alertMessage:message,alertVisible:true,alertType}));
    setTimeout(() => {
      dispatch(updateGeneralParams({alertVisible:false}));
    }, 2000);
  };

  const bodyDom = document.querySelector('body') as HTMLBodyElement;

  const changeBodySize = () => {
    window.innerWidth < 900 ? bodyDom.style.height = window.innerHeight + 'px' : bodyDom.style.height = '';
  }

  useEffect(() => {
    window.addEventListener('resize', changeBodySize);
    changeBodySize();
  }, []);

  const location = useLocation();

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