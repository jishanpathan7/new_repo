import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CoinList } from "./config/api";
import { auth,db } from "./firebase";
const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
 open: false,
 message : "",
 type: "success"
  })

  useEffect(() =>{
    onAuthStateChanged(auth, (user) => {
    if(user) setUser(user)
    else setUser(null)
    })
  },[])

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
  

    setCoins(data);
    setLoading(false);
  };
  useEffect(() => {
    if (currency === "INR") {
      setSymbol("₹");
    } else if (currency === "USD") {
      setSymbol("$");
    }
  }, [currency]);
  return (
    <Crypto.Provider value={{ user,alert, setAlert, currency, symbol, setCurrency ,coins,loading, fetchCoins}}>
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryotoState = () => {
  return useContext(Crypto);
};
