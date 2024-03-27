import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResultContext } from "../contexts/ResultContext";

import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

interface FloorProps {
  id: string;
  name: string;
}

interface RoomProps {
  id: string;
  room_name: string;
  room_area: number;
  room_vertices: [number, number][];
  extinguisher_vertices: [number, number][] | null;
}

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

// TODO: Props to be changed based on result output of AI model
interface ResultProps {
  setCheckResults: Dispatch<SetStateAction<CheckResultProps[]>>;
  setInferResults: Dispatch<SetStateAction<InferResultProps[]>>;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Floor name is required." }),
  room_name: z.string().min(1, { message: "Room name is required." }),
});

// Dummy floor data - TO REMOVE LATER
let floorList: FloorProps[] = [
  { id: "88ea5414-4d31-4918-9d81-d97294d15b5b", name: "1F" },
  { id: "e5476423-6ce2-433f-a831-defe1a8c6867", name: "2F" },
  { id: "779ce6c0-2e2e-42ff-850d-adcb51edd8da", name: "3F" },
];

// Dummy room data - TO REMOVE LATER
const roomList: RoomProps[] = [
  {
    id: "b98e01f0-35d5-460c-975f-6a63406d8f52",
    room_name: "2F - Office",
    room_area: 70,
    room_vertices: [
      [0, 0],
      [8000, 0],
      [8000, 5000],
      [5000, 5000],
      [5000, 19000],
      [8000, 19000],
      [8000, 23000],
      [0, 23000],
      [0, 0],
    ],
    extinguisher_vertices: [
      [500, 0],
      [8000, 3500],
      [0, 19000],
    ],
  },
  {
    id: "67a1ba45-3e13-4ba1-99f6-f931f50dabfc",
    room_name: "2F - Pantry",
    room_area: 70,
    room_vertices: [
      [0, 0],
      [8000, 0],
      [8000, 5000],
      [5000, 5000],
      [5000, 19000],
      [8000, 19000],
      [8000, 23000],
      [0, 23000],
      [0, 0],
    ],
    extinguisher_vertices: [
      [500, 0],
      [8000, 3500],
      [0, 19000],
    ],
  },
  {
    id: "b1955505-0c05-40d4-abe7-fb27c6e1067f",
    room_name: "2F - Corridor",
    room_area: 70,
    room_vertices: [
      [0, 0],
      [8000, 0],
      [8000, 5000],
      [5000, 5000],
      [5000, 19000],
      [8000, 19000],
      [8000, 23000],
      [0, 23000],
      [0, 0],
    ],
    extinguisher_vertices: [
      [500, 0],
      [8000, 3500],
      [0, 19000],
    ],
  },
];

const SelectForm: React.FC<ResultProps> = ({
  setCheckResults,
  setInferResults,
}) => {
  const [allFloors, setAllFloors] = useState<FloorProps[]>([]);
  const [allRooms, setAllRooms] = useState<RoomProps[]>([]);

  const context = useContext(ResultContext);

  const {
    checkResultData,
    setCheckResultData,
    inferResultData,
    setInferResultData,
  } = context;

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      room_name: "",
    },
  });

  const { control, formState, handleSubmit, watch, reset } = form;

  const isLoading = formState.isSubmitting;

  // Reads user input for floor name field.
  const floorNameValue = watch("name");

  // TODO: Stub function to do get request to Revit API to retrieve all relevant floor data. Change the API URL accordingly.
  const getFloors = async (): Promise<FloorProps[]> => {
    const response = await axios.get("https://your-api-endpoint.com/floors");
    return response.data;
  };

  // TODO: To amend this useEffect method once api endpoint is confirmed. useEffect only runs once on mount.
  useEffect(() => {
    /*
    getFloors().then(setAllFloors).catch(error => console.error('Failed to fetch floors:', error))
    */
    setAllFloors(floorList);
  }, []);

  // TODO: Stub function to do get request to Revit API to retrieve all relevant room data based on floor name input. Change the API URL accordingly.
  // May not require getRoomBoundary stub function as would require another API request to Revit?
  
  useEffect(() => {
    /*
    getRooms(floorNameValue).then(setAllRooms).catch(error => console.error('Failed to fetch rooms:', error))
    */
    setAllRooms(roomList);
  }, [floorNameValue]);

  // Handle form submit for check
  // TODO: Stub function to do post request to fire infer API to do check. Change the API URL accordingly.
  const checkExtinguisherPlacement = async (
    values: z.infer<typeof formSchema>,
  ) => {
    try {
      // Add room and extinguisher vertice attributes here. Maybe there is a better way of doing this.
      const chosenRoom = allRooms.filter(
        (room) => room.room_name === values.room_name,
      )[0];
      // TODO: To remove
      console.log({
        ...values,
        room_area: chosenRoom.room_area,
        room_vertices: chosenRoom.room_vertices,
        extinguisher_vertices: chosenRoom.extinguisher_vertices,
      });
      // TODO: To confirm
      const payload = {
        ...values,
        room_area: chosenRoom.room_area,
        room_vertices: chosenRoom.room_vertices,
        extinguisher_vertices: chosenRoom.extinguisher_vertices,
      };
      // TODO: To replace with actual API endpoint
      const response = await axios.post(
        "https://your-api-endpoint.com/checkExtinguisher",
        payload,
      );
      // Pass the states upwards and through context
      setCheckResults(response.data);
      // Context passed to Extinguisher and Hosereel Plans
      setCheckResultData(response.data);
      toast({
        variant: "success",
        title: "Success!",
        description: "Room data exported successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failure to submit room data. Please try again.",
      });
    }
  };

  // Handle form submit for inference
  // TODO: Stub function to do post request to fire infer API to do check. Change the API URL accordingly.
  const inferExtinguisherPlacement = async (
    values: z.infer<typeof formSchema>,
  ) => {
    try {
      // Add room and extinguisher vertice attributes here. Maybe there is a better way of doing this.
      const chosenRoom = allRooms.filter(
        (room) => room.room_name === values.room_name,
      )[0];
      // TODO: To remove
      console.log({
        ...values,
        room_area: chosenRoom.room_area,
        room_vertices: chosenRoom.room_vertices,
        extinguisher_vertices: chosenRoom.extinguisher_vertices,
      });
      // TODO: To confirm
      const payload = {
        ...values,
        room_area: chosenRoom.room_area,
        room_vertices: chosenRoom.room_vertices,
        extinguisher_vertices: chosenRoom.extinguisher_vertices,
      };
      // TODO: To replace with actual API endpoint
      const response = await axios.post(
        "https://your-api-endpoint.com/checkExtinguisher",
        payload,
      );
      // Pass the states upwards and through context
      setInferResults(response.data);
      // Context passed to Extinguisher and Hosereel Plans
      setInferResultData(response.data);
      toast({
        variant: "success",
        title: "Success!",
        description: "Room data exported successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failure to submit room data. Please try again.",
      });
    }
  };


  /*
   * Updates the state of the Room collection
   * */
  function updateRooms(e : any = {}){
    console.log("Updating Floors!");
    console.log(e);
    let floors = e.detail?.Floors;
    if(floors == null) { return };
    document.dispatchEvent(new CustomEvent('setAllFloors', {
      "detail": floors
    }));
  }


  /**
   * Triggers Revit to get Room info.
   */
  function getRooms(e : string){
    console.log("Getting Rooms!");
    console.log(e)
    let wv2msg = {"action": "getRooms", "payload": {"fn": "updateRooms", "level": e}}
    console.log(wv2msg);
    try{
      let w = window as any
      w.chrome?.webview?.postMessage(wv2msg);
    }catch(err){
      // May be able to send the function name.
      console.log("Not in Revit context. Aborting.");
    }
  }

  // Reset form fields upon successful submission
  useEffect(() => {
      document.addEventListener("setAllFloors", (e : any) => {
        // FIXME: To avoid multiple event updates...
        // Currently its because event listener is on all SelectForm instances...
        // May need to differentiate it.
        console.log("Setting all floors!");
        console.log(e);
        setAllFloors(e.detail);
        // TODO: Dispatch another revit event to get the rooms of the floor.
      });

    if (formState.isSubmitSuccessful) {
      reset({ name: "", room_name: "" });
    }
  }, [formState, reset]);

  return (
    <div className="border border-primary/10 rounded-md bg-gray-200 drop-shadow-md h-full p-3">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(checkExtinguisherPlacement)}
          className="space-y-4"
        >
          <FormField
            name="name"
            control={control}
            render={({ field }) => (
              <FormItem id="floor-select" className="col-span-1 md:col-span-1">
                <FormLabel className="text-lg font-bold flex justify-start">
                  Floor
                </FormLabel>
                <Select
                  disabled={isLoading || allFloors.length === 0}
                  onValueChange={(e)=>{field.onChange(e); getRooms(e)}} // Trigger when floor is selected to get the floor's rooms
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select Floor"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent >
                    {allFloors?.map((floor) => (
                      <SelectItem key={floor.id} value={floor.name}>
                        {floor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="room_name"
            control={control}
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1">
                <FormLabel className="text-lg font-bold flex justify-start">
                  Room
                </FormLabel>
                <Select
                  disabled={isLoading || allRooms.length === 0}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select Room"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allRooms?.map((room) => (
                      <SelectItem key={room.id} value={room.room_name}>
                        {room.room_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-start space-x-4 pt-10">
            <Button disabled={isLoading}>Check</Button>
            <Button
              disabled={isLoading}
              onClick={handleSubmit(inferExtinguisherPlacement)}
            >
              Suggest
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SelectForm;
