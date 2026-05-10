import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateGeneralParams } from "../redux/generalParamsSlice";
import { alertProps, queryResultFields } from "../utils/interfaces";
import { RootState } from "../redux/store";
import { disconnectUser, queryDynamic } from "../utils/fetchFuncs";

export default function Home({showAlert}:{showAlert:alertProps}) {
  const generalParams = useAppSelector((state:RootState) => state.generalParamsSlice);

  const dispatch = useAppDispatch();

  const queryclient = useQueryClient();

  const deconnectFunc = async () => {
    const response = await disconnectUser(showAlert);

    if (!response.success) return showAlert('la déconnexion a échoué, réessayez. '+(response.message || ''),'alert');

    showAlert(response.message,'valid');

    delete sessionStorage.userStored;
    dispatch(updateGeneralParams({connected:false}));
    queryclient.removeQueries('user');
  }

  const handleData = (result:queryResultFields) => {

    result.data.length ? sessionStorage.setItem('comicsStorage',JSON.stringify(result.data)) : 
    (result.message && showAlert(result.message,'error'));
    return result;
  }
  
    const { isLoading,data } = useQuery(
        ['comics'],
        queryDynamic,
        {
            staleTime: 7200000
        }
    )

  useEffect(() => {
    data && handleData(data);
    data && console.log(data);
  }, [data])
  

  useEffect(() => {
    dispatch(updateGeneralParams({isLoading}));
  }, [isLoading])

  return (
    <div className="home-page">
      {!generalParams.connected ? <Link to={'/connect'} className='connect-link'>
        <button className="connect-button">Connexion</button>
        </Link> : 
        <button onClick={deconnectFunc} className="connect-button deconnect">Déconnexion</button>}
        <Link to={'/comics'}>
          <button className="color-button">Go to comics !</button>
        </Link>
    </div>
  )
}