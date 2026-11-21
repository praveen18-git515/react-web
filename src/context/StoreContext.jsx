import { createContext, useContext, useEffect, useState } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("rideverse-wishlist") || "[]"));
  const [compare, setCompare] = useState(() => JSON.parse(localStorage.getItem("rideverse-compare") || "[]"));
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem("rideverse-recent") || "[]"));
  const [configurations, setConfigurations] = useState(() => JSON.parse(localStorage.getItem("rideverse-configurations") || "[]"));
  const [toast, setToast] = useState("");

  useEffect(() => localStorage.setItem("rideverse-wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("rideverse-compare", JSON.stringify(compare)), [compare]);
  useEffect(() => localStorage.setItem("rideverse-recent", JSON.stringify(recent)), [recent]);
  useEffect(() => localStorage.setItem("rideverse-configurations", JSON.stringify(configurations)), [configurations]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const toggleWishlist = (id) => {
    setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };
  const toggleCompare = (id) => {
    setCompare((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) {
        setToast("Compare supports up to three motorcycles.");
        return current;
      }
      setToast("Added to comparison.");
      return [...current, id];
    });
  };
  const markRecent = (id) => setRecent((current) => [id, ...current.filter((item) => item !== id)].slice(0, 6));
  const saveConfiguration = (configuration) => {
    setConfigurations((current) => [{ ...configuration, id: Date.now() }, ...current].slice(0, 20));
    setToast("Configuration saved to My Garage.");
  };

  return <StoreContext.Provider value={{ wishlist, compare, recent, configurations, toast, setToast, toggleWishlist, toggleCompare, markRecent, saveConfiguration, setCompare }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
