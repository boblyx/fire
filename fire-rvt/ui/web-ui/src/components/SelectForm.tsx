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
import { CheckResultProps, InferResultProps } from "./Interfaces";
import { RoomProps, FloorProps } from "../contexts/ResultContext";
const ENDPOINTS = {

    "/check/coverage": "http://localhost:41983/check/coverage"
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
  const context = useContext(ResultContext);
  const {
    allFloors,
    setAllFloors,
    allRooms,
    setAllRooms,
    currentRoom,
    setCurrentRoom,
    currentFloor,
    setCurrentFloor,
    checkResultData,
    setCheckResultData
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

  // TODO: To amend this useEffect method once api endpoint is confirmed. useEffect only runs once on mount.
  useEffect(() => {
    /*
    getFloors().then(setAllFloors).catch(error => console.error('Failed to fetch floors:', error))
    */
    setAllFloors(floorList);
  }, []);

  useEffect(() => {
  }, [floorNameValue]);

  /**
   * TODO: Scale vertices if they are too small.
   * @author Bob YX Lee
   */
  async function checkExtinguisherPlacement(){
    let cdata = checkResultData[0]
    let vertices = cdata.room_vertices;
    let obs_verts = cdata.obstacle_vertices;
    
    /*
    for(let i = 0; i < obs_verts.length; i++){
        let cob = obs_verts[i];
        for(let n = 0; n < cob.length; n++){
            vertices.push(cob[n]);
        }
    }*/
    let payload = {
        room_dict : {
           vertices:  vertices,
           obstacles: obs_verts,
           faces: []
        },
        exts : cdata.extinguisher_vertices
    }

    // FOR DEBUG. DO NOT REMOVE
    console.log(JSON.stringify(payload));

    try{
    const response = await axios.post(
      ENDPOINTS["/check/coverage"],
      payload,
    );

    let res : any = response.data

    if(Object.keys(res).includes("error")){
        console.log("Error occurred");
        return;
    }
    
    let new_chk : CheckResultProps = checkResultData[0];

    if(res.result === true){
        new_chk.result = "PASS";
    }else{
        new_chk.result = "FAIL";
    }
    new_chk.uncovered = res.diff;
    console.log(res);
    console.log(new_chk);
    setCheckResultData([new_chk]);

    // toast doesn't seem to work
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
  }

  /*
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
  };*/

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
    
    setCurrentFloor(the_floor);
    setAllRooms(the_floor.rooms);
    // TODO change room placeholder to say: "Select Room"
    // when rooms are loaded
  }
  /**
   * Triggers draw room routine.
   */
  function drawRoom(e : string){
    console.log("Drawing room!");
    console.log(currentFloor);
    console.log(e);
    if((currentFloor?.rooms == undefined)){return;}
    // Get the room
    let the_room : any;
    for(let i = 0; i < currentFloor.rooms.length; i++){
        let c_rm = currentFloor.rooms[i];
        if(!(c_rm.name == e)){ continue; }
        the_room = c_rm;
        break;
    }
    if(the_room == undefined){ return; }
    setCurrentRoom(the_room);
    document.dispatchEvent(new CustomEvent('show-plan'));
    return;
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
                  onValueChange={(e) => {field.onChange(e); drawRoom(e)}}
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
