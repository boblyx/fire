import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

// TODO: Props to be changed based on result output of AI model
interface CheckResultProps {
  id: string;
  room_name: string;
  room_area: number;
  room_vertices: [number, number][];
  extinguisher_vertices: [number, number][];
  path_vertices: [number, number][];
  rating: number;
  result: string;
}

// TODO: Props to be changed based on result output of AI model
interface InferResultProps {
  id: string;
  room_name: string;
  room_area: number;
  room_vertices: [number, number][];
  extinguisher_vertices: [number, number][];
  path_vertices: [number, number][];
  rating: number;
  result: string;
}

interface ResultContextType {
  checkResultData: CheckResultProps[];
  setCheckResultData: Dispatch<SetStateAction<CheckResultProps[]>>;
  inferResultData: InferResultProps[];
  setInferResultData: Dispatch<SetStateAction<InferResultProps[]>>;
}

interface Props {
  children: ReactNode;
}

export const ResultContext = createContext<ResultContextType>({
  checkResultData: [],
  setCheckResultData: () => {},
  inferResultData: [],
  setInferResultData: () => {},
});

export const ResultContextProvider: React.FC<Props> = ({ children }) => {
  const [checkResultData, setCheckResultData] = useState<CheckResultProps[]>(
    [],
  );
  const [inferResultData, setInferResultData] = useState<InferResultProps[]>(
    [],
  );

  return (
    <ResultContext.Provider
      value={{
        checkResultData,
        setCheckResultData,
        inferResultData,
        setInferResultData,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};
