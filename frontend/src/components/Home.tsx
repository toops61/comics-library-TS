import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateGeneralParams } from "../redux/generalParamsSlice";
import { queryDynamic } from "../utils/utilsFuncs";
import { alertProps, queryResultFields } from "../utils/interfaces";
import { RootState } from "../redux/store";

export default function Home({showAlert}:alertProps) {
  const generalParams = useAppSelector((state:RootState) => state.generalParamsSlice);

  const dispatch = useAppDispatch();

  const queryclient = useQueryClient();

  const deconnectFunc = () => {
    dispatch(updateGeneralParams({connected:false}));
    queryclient.removeQueries({ queryKey:'user', exact: true });
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
  }, [data])
  

  useEffect(() => {
    dispatch(updateGeneralParams({isLoading}));
  }, [isLoading])

  return (
    <div className="home-page">
      {!generalParams.connected ? <Link to={'/connect'} className='connect-link'>
        <button className="connect-button">Connexion</button>
        </Link> : 
        <button onClick={deconnectFunc} className="connect-button">Déconnexion</button>}
        <Link to={'/comics'}>
          <button className="color-button">Go to comics !</button>
        </Link>
    </div>
  )
}