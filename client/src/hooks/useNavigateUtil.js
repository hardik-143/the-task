import { useNavigate } from "react-router-dom";

export const useNavigateUtil = () => {
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };
  return navigateTo;
};


// usage
// const navigateTo = useNavigateUtil();
// navigateTo("/login");
