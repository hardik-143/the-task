import { useEffect } from "react";
import { handleFetchTodos } from "../reducers/todoSlice";
import { useDispatch } from "react-redux";

export default function Todos() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleFetchTodos());
  }, []);
  return (
    <div className="flex flex-col justify-center h-screen">
      <h1>Todos</h1>
      <div className="flex flex-col justify-center h-screen">
        <h1>Todos</h1>
      </div>
    </div>
  );
}
