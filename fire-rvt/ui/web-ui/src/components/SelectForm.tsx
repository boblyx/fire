/**
 * SelectForm.tsx
 * Component for rendering dropdown boxes for 
 * users to select floors / rooms 
 */
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

import { SAMPLE_FLOORS } from "./samples/floor";


interface RoomProps {
  id : string;
  name : string;
  level : string;
  vertices: number[][][][];
  //extinguisher_vertices: [number, number][] | null;
}

interface FloorProps {
  id: string;
  name: string;
  rooms : RoomProps[] | null; // TODO: change to RoomProps
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
let floorList: FloorProps[] = SAMPLE_FLOORS;

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
  }, [floorNameValue]);

  // Handle form submit for check
  // TODO: Stub function to do post request to fire infer API to do check. Change the API URL accordingly.
  const checkExtinguisherPlacement = async (
    values: z.infer<typeof formSchema>,
  ) => {
    /*
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
      }*/
  };

  // Handle form submit for inference
  // TODO: Stub function to do post request to fire infer API to do check. Change the API URL accordingly.
  const inferExtinguisherPlacement = async (
    values: z.infer<typeof formSchema>,
  ) => {
    /*
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
      */
  };


  /**
   * Updates the state of the Room collection
   * @author Bob YX Lee
   */
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
   * Triggers population of rooms dropdown to get Room info.
   * @author Bob YX Lee
   */
  function getRooms(e : string){
    console.log("Getting Rooms!");
    console.log(allFloors);
    console.log(e);
    let the_floor : any = null;
    for(let i = 0; i < allFloors.length; i++){
      if(e !== allFloors[i].name){ continue }
      the_floor = allFloors[i] as FloorProps;
    }
    if (the_floor == null){ return; };

    // Since floors already contain room info,
    // We can just load directly from the floor collection
    
    setAllRooms(the_floor.rooms);
    // TODO change room placeholder to say: "Select Room"
    // when rooms are loaded
    
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
                        placeholder="Select a Floor First"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allRooms?.map((room) => (
                      <SelectItem key={room.id} value={room.name}>
                        {room.name}
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
